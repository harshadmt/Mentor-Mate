import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash, 
  FaPhoneSlash, 
  FaExpand, 
  FaCompress,
  FaUser,
  FaExclamationTriangle,
  FaCog
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const socket = io("http://localhost:5000", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VideoCallPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const containerRef = useRef(null);
  const socketRef = useRef(socket);

  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remoteUser, setRemoteUser] = useState("Participant");
  const [permissionError, setPermissionError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [mediaState, setMediaState] = useState({
    hasAudio: false,
    hasVideo: false,
    isAudioDenied: false,
    isVideoDenied: false
  });

  const cleanupMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  };

  const cleanupPeerConnection = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
  };

  const cleanupSocketListeners = () => {
    const socket = socketRef.current;
    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
    socket.off("user-info");
    socket.emit("leave-room", id);
  };

  const endCall = () => {
    cleanupPeerConnection();
    cleanupMedia();
    cleanupSocketListeners();
    navigate(-1);
  };

  const initMediaStream = async () => {
    try {
      const constraints = {
        audio: !mediaState.isAudioDenied,
        video: !mediaState.isVideoDenied && {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
        .catch(err => {
          if (err.name === 'NotAllowedError') {
            const isAudioDenied = err.message.includes('audio');
            const isVideoDenied = err.message.includes('video');
            
            setPermissionError(
              `Please allow ${isAudioDenied && isVideoDenied ? 'microphone and camera' : 
              isAudioDenied ? 'microphone' : 'camera'} access`
            );
            
            setMediaState(prev => ({
              ...prev,
              isAudioDenied: isAudioDenied || prev.isAudioDenied,
              isVideoDenied: isVideoDenied || prev.isVideoDenied
            }));
            
            throw err;
          }
          throw err;
        });

      const hasAudio = stream.getAudioTracks().length > 0;
      const hasVideo = stream.getVideoTracks().length > 0;
      
      setMediaState({
        hasAudio,
        hasVideo,
        isAudioDenied: !hasAudio && mediaState.isAudioDenied,
        isVideoDenied: !hasVideo && mediaState.isVideoDenied
      });

      if (hasAudio || hasVideo) {
        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;
        setPermissionError(null);
        return true;
      } else {
        setPermissionError('Camera and microphone access are required');
        return false;
      }
    } catch (err) {
      console.error("Error initializing media:", err);
      }
  };

  const initSocketConnection = () => {
    const socket = socketRef.current;
    socket.emit("join-room", id);

    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice-candidate", handleNewICECandidate);
    socket.on("user-info", (info) => setRemoteUser(info.name || "Participant"));
  };

  useEffect(() => {
    const init = async () => {
      const mediaSuccess = await initMediaStream();
      if (mediaSuccess) {
        initSocketConnection();
      }
    };

    init();

    return () => {
      cleanupPeerConnection();
      cleanupMedia();
    };
  }, [retryCount, id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUserJoined = (userId) => {
    setConnected(true);
    const peer = createPeer(userId);
    peerRef.current = peer;
  };

  const createPeer = (userId) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
      ]
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          candidate: event.candidate,
          to: userId
        });
      }
    };

    peer.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "disconnected" || peer.connectionState === "failed") {
        endCall();
      }
    };

    localStreamRef.current.getTracks().forEach(track => {
      peer.addTrack(track, localStreamRef.current);
    });

    return peer;
  };

  const handleReceiveOffer = async ({ offer, from }) => {
    setConnected(true);
    const peer = createPeer(from);
    peerRef.current = peer;

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socketRef.current.emit("answer", {
      answer,
      to: from
    });
  };

  const handleReceiveAnswer = ({ answer }) => {
    peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleNewICECandidate = ({ candidate }) => {
    if (candidate && peerRef.current) {
      peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const requestPermissionAgain = () => {
    setPermissionError(null);
    setRetryCount(prev => prev + 1);
  };

  const continueWithoutVideo = () => {
    setMediaState(prev => ({ ...prev, isVideoDenied: true }));
    setRetryCount(prev => prev + 1);
  };

  const toggleMic = () => {
    if (!mediaState.hasAudio) return;
    
    const micTrack = localStreamRef.current?.getAudioTracks()[0];
    if (micTrack) {
      micTrack.enabled = !micTrack.enabled;
      setMicOn(micTrack.enabled);
    }
  };

  const toggleCamera = () => {
    if (!mediaState.hasVideo) return;
    
    const camTrack = localStreamRef.current?.getVideoTracks()[0];
    if (camTrack) {
      camTrack.enabled = !camTrack.enabled;
      setCameraOn(camTrack.enabled);
    }
  };

  if (permissionError) {
    return (
      <div className="min-h-screen bg-blue-50 text-blue-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg border border-blue-100">
          <FaExclamationTriangle className="text-blue-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Permission Required</h2>
          <p className="mb-6">{permissionError}</p>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={requestPermissionAgain}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition"
            >
              Try Again
            </button>
            
            {mediaState.isVideoDenied && !mediaState.isAudioDenied && (
              <button
                onClick={continueWithoutVideo}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition"
              >
                Continue Without Video
              </button>
            )}
            
            <button
              onClick={() => navigate(-1)}
              className="bg-white hover:bg-blue-50 text-blue-600 py-3 px-6 rounded-lg font-medium transition border border-blue-200"
            >
              Go Back
            </button>
          </div>

          <div className="mt-8 text-sm text-blue-600">
            <p className="mb-2 font-medium">Troubleshooting:</p>
            <ul className="list-disc list-inside space-y-1 text-left mx-auto max-w-xs">
              <li>Check your browser's permission settings</li>
              <li>Make sure no other app is using your camera/mic</li>
              <li>Refresh the page and try again</li>
              {mediaState.isVideoDenied && (
                <li>Click "Continue Without Video" for audio-only</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-blue-50 text-blue-900 flex flex-col items-center justify-center p-4 relative"
    >
      {/* Call header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-white rounded-full px-4 py-2 flex items-center shadow-sm border border-blue-100">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
            <FaUser size={12} className="text-white" />
          </div>
          <span className="font-medium">{remoteUser}</span>
          <span className="mx-2 text-blue-300">•</span>
          <span>{formatTime(callDuration)}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white hover:bg-blue-50 transition shadow-sm border border-blue-100"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? <FaCompress size={16} className="text-blue-600" /> : <FaExpand size={16} className="text-blue-600" />}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full bg-white hover:bg-blue-50 transition shadow-sm border border-blue-100"
            aria-label="Settings"
          >
            <BsThreeDotsVertical size={16} className="text-blue-600" />
          </button>
        </div>
      </div>

      {/* Video containers */}
      <div className={`relative w-full max-w-6xl ${fullscreen ? 'h-screen' : 'h-[80vh]'} rounded-xl overflow-hidden bg-white shadow-lg border border-blue-100`}>
        {/* Remote video (main) */}
        <div className={`absolute inset-0 ${connected ? '' : 'flex items-center justify-center'}`}>
          {connected ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <FaUser size={48} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Waiting for {remoteUser} to join...</h3>
              <p className="text-blue-500">You can start your {mediaState.hasVideo ? 'video' : 'audio'} call as soon as they join</p>
            </div>
          )}
        </div>

        {/* Local video (pip) - only shown if video is available */}
        {mediaState.hasVideo && (
          <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white shadow-lg bg-blue-50">
            {cameraOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100">
                <FaVideoSlash size={32} className="text-blue-400" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex gap-4 bg-white rounded-full px-6 py-3 shadow-lg border border-blue-100">
          <button
            onClick={toggleMic}
            disabled={!mediaState.hasAudio}
            className={`p-3 rounded-full flex flex-col items-center ${
              !mediaState.hasAudio ? 'bg-blue-100 text-blue-400 cursor-not-allowed' :
              micOn ? 'bg-blue-100 text-blue-600' : 'bg-red-500 text-white'
            } hover:opacity-80 transition`}
            aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
          >
            {micOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
            <span className="text-xs mt-1">
              {!mediaState.hasAudio ? "No Mic" : micOn ? "Mute" : "Unmute"}
            </span>
          </button>
          
          {mediaState.hasVideo && (
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-full flex flex-col items-center ${
                cameraOn ? 'bg-blue-100 text-blue-600' : 'bg-red-500 text-white'
              } hover:opacity-80 transition`}
              aria-label={cameraOn ? "Turn off camera" : "Turn on camera"}
            >
              {cameraOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
              <span className="text-xs mt-1">{cameraOn ? "Stop Video" : "Start Video"}</span>
            </button>
          )}
          
          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition transform hover:scale-110 flex flex-col items-center"
            aria-label="End call"
          >
            <FaPhoneSlash size={20} />
            <span className="text-xs mt-1">End Call</span>
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute right-4 bottom-20 bg-white rounded-lg p-4 shadow-xl w-64 z-20 border border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium flex items-center text-blue-800">
              <FaCog className="mr-2 text-blue-600" /> Settings
            </h4>
            <button 
              onClick={() => setShowSettings(false)}
              className="text-blue-400 hover:text-blue-600"
              aria-label="Close settings"
            >
              &times;
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-blue-600 mb-1">Microphone</label>
              <select 
                className="w-full bg-blue-50 rounded p-2 text-sm border border-blue-100"
                disabled={!mediaState.hasAudio}
              >
                <option>Default Microphone</option>
              </select>
              {!mediaState.hasAudio && (
                <p className="text-xs text-red-500 mt-1">Microphone access denied</p>
              )}
            </div>
            {mediaState.hasVideo && (
              <div>
                <label className="block text-sm text-blue-600 mb-1">Camera</label>
                <select className="w-full bg-blue-50 rounded p-2 text-sm border border-blue-100">
                  <option>Default Camera</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm text-blue-600 mb-1">Speaker</label>
              <select className="w-full bg-blue-50 rounded p-2 text-sm border border-blue-100">
                <option>Default Speaker</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;