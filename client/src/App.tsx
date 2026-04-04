import { useCourseGeneration } from './hooks/useCourseGeneration';
import { TopicInput } from './components/TopicInput';
import { CourseViewer } from './components/CourseViewer';
import { GenerationProgress } from './components/GenerationProgress';

function App() {
  const {
    courseData,
    status,
    error,
    activeLessonIndex,
    setActiveLessonIndex,
    generateCourse,
    resetCourse,
  } = useCourseGeneration();

  const isLoading =
    status === 'generating_outline' ||
    status === 'generating_lessons' ||
    status === 'finding_videos' ||
    status === 'generating_quizzes';

  return (
    <div className="app-container">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />

      {status === 'done' && courseData ? (
        <CourseViewer
          course={courseData}
          activeLessonIndex={activeLessonIndex}
          setActiveLessonIndex={setActiveLessonIndex}
          onReset={resetCourse}
        />
      ) : isLoading ? (
        <GenerationProgress status={status} />
      ) : (
        <TopicInput onSubmit={generateCourse} status={status} error={error} />
      )}
    </div>
  );
}

export default App;
