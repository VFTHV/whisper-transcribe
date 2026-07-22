import { useState, useRef, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { Mic, Pause } from "@mui/icons-material";
import { useAppSelector } from "../../store/hooks";
import {
  selectIsPaused,
  selectIsRecording,
} from "../../features/recording/slice/selectors";

const RecordingTimer = () => {
  const isRecording = useAppSelector(selectIsRecording);
  const isPaused = useAppSelector(selectIsPaused);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingStartTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);
  const pauseStartTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

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

  const startTimer = useCallback(() => {
    recordingStartTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
    updateRecordingTime();
  }, [updateRecordingTime]);

  const pauseTimer = useCallback(() => {
    pauseStartTimeRef.current = Date.now();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (pauseStartTimeRef.current > 0) {
      totalPausedTimeRef.current += Date.now() - pauseStartTimeRef.current;
      pauseStartTimeRef.current = 0;
    }
    updateRecordingTime();
  }, [updateRecordingTime]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      if (recordingStartTimeRef.current === 0) {
        startTimer();
      } else {
        resumeTimer();
      }
    } else if (isRecording && isPaused) {
      pauseTimer();
    } else if (!isRecording) {
      resetTimer();
    }
  }, [isRecording, isPaused, startTimer, pauseTimer, resumeTimer, resetTimer]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          px: 2.5,
          py: 1.5,
          borderRadius: 4,
          fontFamily: "monospace",
          fontWeight: "bold",
        }}
      >
        <Mic sx={{ fontSize: 20 }} />
        <Typography variant="body1" sx={{ minWidth: 60, textAlign: "center" }}>
          {formatTime(recordingTime)}
        </Typography>
        {isPaused && <Pause sx={{ fontSize: 18 }} />}
      </Box>
    </Box>
  );
};

export default RecordingTimer;
