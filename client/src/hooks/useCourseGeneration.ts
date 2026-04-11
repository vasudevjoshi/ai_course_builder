import { useState, useCallback } from 'react';
import type { CourseResponse, GenerationStatus } from '../types/course';
import { generateCourse as apiGenerateCourse } from '../services/courseApi';
import { MOCK_COURSE } from '../mocks/mockCourse';

const USE_MOCK = true;

interface UseCourseGenerationReturn {
  courseData: CourseResponse | null;
  status: GenerationStatus;
  error: string | null;
  activeLessonIndex: number;
  setActiveLessonIndex: (index: number) => void;
  generateCourse: (topic: string) => Promise<void>;
  resetCourse: () => void;
}

export function useCourseGeneration(): UseCourseGenerationReturn {
  const [courseData, setCourseData] = useState<CourseResponse | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const generateCourse = useCallback(async (topic: string) => {
    setError(null);
    setStatus('generating_outline');

    try {
      if (USE_MOCK) {
        // Simulate phased loading for development
        await delay(700);
        setStatus('generating_lessons');
        await delay(700);
        setStatus('finding_videos');
        await delay(700);
        setStatus('generating_quizzes');
        await delay(500);

        const mockResult: CourseResponse = {
          ...MOCK_COURSE,
          topic,
          courseTitle: `Mastering ${topic}`,
        };

        setCourseData(mockResult);
        setStatus('done');
        setActiveLessonIndex(0);
      } else {
        setStatus('generating_outline');
        await delay(400);
        setStatus('generating_lessons');
        await delay(400);
        setStatus('finding_videos');
        await delay(400);
        setStatus('generating_quizzes');

        const data = await apiGenerateCourse(topic);
        setCourseData(data);
        setStatus('done');
        setActiveLessonIndex(0);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(message);
      setStatus('error');
    }
  }, []);

  const resetCourse = useCallback(() => {
    setCourseData(null);
    setStatus('idle');
    setError(null);
    setActiveLessonIndex(0);
  }, []);

  return {
    courseData,
    status,
    error,
    activeLessonIndex,
    setActiveLessonIndex,
    generateCourse,
    resetCourse,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
