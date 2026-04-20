import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import API from "../api/axios";

const socket = io("http://localhost:5000");

const VideoCall = ({ roomId, appointmentId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState(null);
  const [callStarted, setCallStarted] = useState(false);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const createPeer = () => {
    const pc = new RTCPeerConnection(servers);

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    return pc;
  };

  const initStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      localVideoRef.current.srcObject = stream;
    } catch (err) {
      console.log(err.message);
    }
  };

  const startSession = async () => {
    try {
      const res = await API.post(`/appointments/start/${appointmentId}`);

      setStatus(res.data.appointment);

      socket.emit("doctor-started", { roomId });
      socket.emit("patient-started", { roomId });

    } catch (err) {
      console.log(err.message);
    }
  };

  const checkStatus = async () => {
    try {
      const res = await API.get(`/appointments/${appointmentId}`);
      setStatus(res.data);

      if (res.data.doctorStarted && res.data.patientStarted) {
        setCallStarted(true);
        createOffer();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const createOffer = async () => {
    try {
      const pc = createPeer();
      pcRef.current = pc;

      streamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, streamRef.current);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", { roomId, offer });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    initStream();
    socket.emit("join-room", roomId);

    socket.on("offer", async (offer) => {
      const pc = createPeer();
      pcRef.current = pc;

      streamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, streamRef.current);
      });

      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await pcRef.current?.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        await pcRef.current?.addIceCandidate(candidate);
      } catch (err) {
        console.log(err);
      }
    });


    socket.on("doctor-started", () => checkStatus());
    socket.on("patient-started", () => checkStatus());

    checkStatus();

    return () => {
      socket.off("doctor-started");
      socket.off("patient-started");
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Video Call Room</h2>

      <div style={{ marginBottom: 10 }}>
        <p>Doctor: {status?.doctorStarted ? "✅" : "❌"}</p>
        <p>Patient: {status?.patientStarted ? "✅" : "❌"}</p>

        <button onClick={startSession}>🚀 Start Session</button>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <video ref={localVideoRef} autoPlay muted width="300" />
        <video ref={remoteVideoRef} autoPlay width="300" />
      </div>

      {callStarted && <h3 style={{ color: "green" }}>🎥 Call Active</h3>}
    </div>
  );
};

export default VideoCall;