import { memo, useState, useCallback } from "react"
import Image from "next/image"
import { ShimmerEffect } from "../ui/shimmer-effect"

interface ProjectType {
  title: string;
  image?: string;
  description?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies?: string[];
}

export const TechnologyBadge = memo(({ tech }: { tech: string }) => (
  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-white/10 text-white/90">
    {tech}
  </span>
));

TechnologyBadge.displayName = "TechnologyBadge";

export const ProjectMedia = memo(({ project, onMediaLoad }: { 
  project: ProjectType, 
  onMediaLoad: () => void 
}) => {
  const isVideo = project.image?.endsWith('.mp4') || project.image?.endsWith('.webm');
  
  return (
    <div className="w-full h-full relative">
      {isVideo ? (
        <video
          src={project.image || "/placeholder.svg"}
          title={project.title}
          className="object-cover w-full h-full rounded-lg"
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={onMediaLoad}
          aria-label={`${project.title} preview video`}
        />
      ) : (
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 85vw, 320px"
          className="object-cover rounded-lg"
          onLoad={onMediaLoad}
          priority={true}
        />
      )}
      
      {(project.demoUrl || project.githubUrl) && (
        <a 
          href={project.demoUrl || project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1 right-1 bg-black/50 p-1 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
          aria-label={`Visit ${project.title}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      )}
    </div>
  );
});

ProjectMedia.displayName = "ProjectMedia";

export const ProjectMessage = ({ 
  content,
  project,
  bubbleClass,
  bubbleMaxWidth
}: {
  content?: string;
  project: ProjectType;
  bubbleClass: string;
  bubbleMaxWidth: string;
}) => {
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const handleMediaLoad = useCallback(() => {
    setMediaLoaded(true);
  }, []);

  return (
    <div className={`${bubbleClass} px-4 py-2 ${bubbleMaxWidth} relative`}>
      <div className="space-y-2">
        {content && (
          <p className="text-[14px] leading-tight">{content}</p>
        )}
        <div className="overflow-hidden rounded-lg">
          <div className="flex flex-col">
            <div className="relative h-[112px] bg-gray-800/40">
              {!mediaLoaded && (
                <div className="absolute inset-0 overflow-hidden bg-gray-800/80 rounded-lg" aria-label="Loading project preview">
                  <ShimmerEffect />
                </div>
              )}
              
              <ProjectMedia 
                project={project} 
                onMediaLoad={handleMediaLoad} 
              />
            </div>
            
            <div className="p-2.5">
              <div className="flex justify-between items-start">
                <h3 className="text-[14px] font-medium text-white/95">{project.title}</h3>
                {(project.demoUrl || project.githubUrl) && (
                  <a
                    href={project.demoUrl || project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors ml-1.5 flex-shrink-0"
                    aria-label={`Open ${project.title} project`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                )}
              </div>
              
              {project.description && (
                <p className="text-[12px] text-white/70 leading-tight mt-1">
                  {project.description}
                </p>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {project.technologies.map((tech, i) => (
                    <TechnologyBadge key={i} tech={tech} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};