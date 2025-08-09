import { useState, useRef, useEffect, useCallback } from "react";
import "./RecordingTimer.css";

type Props = {
  isRecording: boolean;
  isPaused: boolean;
};

const RecordingTimer = ({ isRecording, isPaused }: Props) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingStartTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);
  const pauseStartTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Update recording time
  const updateRecordingTime = useCallback(() => {
    if (!isRecording || isPaused) return;

    const currentTime = Date.now();
    const elapsedTime =
      (currentTime -
        recordingStartTimeRef.current -
        totalPausedTimeRef.current) /
      1000;
    setRecordingTime(elapsedTime);

    animationFrameRef.current = requestAnimationFrame(updateRecordingTime);
  }, [isRecording, isPaused]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setRecordingTime(0);
    recordingStartTimeRef.current = 0;
    totalPausedTimeRef.current = 0;
    pauseStartTimeRef.current = 0;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, []);

  // Start timer
  const startTimer = useCallback(() => {
    recordingStartTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
    updateRecordingTime();
  }, [updateRecordingTime]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    pauseStartTimeRef.current = Date.now();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, []);

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (pauseStartTimeRef.current > 0) {
      totalPausedTimeRef.current += Date.now() - pauseStartTimeRef.current;
      pauseStartTimeRef.current = 0;
    }
    updateRecordingTime();
  }, [updateRecordingTime]);

  // Handle recording state changes
  useEffect(() => {
    if (isRecording && !isPaused) {
      if (recordingStartTimeRef.current === 0) {
        // Starting new recording
        startTimer();
      } else {
        // Resuming from pause
        resumeTimer();
      }
    } else if (isRecording && isPaused) {
      // Pausing
      pauseTimer();
    } else if (!isRecording) {
      // Stopping or canceling
      resetTimer();
    }
  }, [isRecording, isPaused, startTimer, pauseTimer, resumeTimer, resetTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="recording-timer">
      <div className="timer-display">
        <span className="timer-icon">🎤</span>
        <span className="timer-text">{formatTime(recordingTime)}</span>
        {isPaused && <span className="paused-indicator">⏸️</span>}
      </div>
    </div>
  );
};

export default RecordingTimer;
