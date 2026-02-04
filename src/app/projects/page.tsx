import ProjectsClient from './ProjectsClient';
import { PROJECTS } from '@/content/projects';

export default function ProjectsPage() {
  return <ProjectsClient initialProjects={PROJECTS} />;
}
