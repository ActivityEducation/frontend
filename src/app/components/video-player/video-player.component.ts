import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, AfterViewInit, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Utility Functions ---
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
};

// --- Interfaces ---
export interface VideoInterrupt {
  timestampSeconds: number;
  content: TemplateRef<any>; // Use TemplateRef for Angular content projection
  id: string;
}

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
  // --- Inputs & Outputs ---
  @Input() src!: string;
  @Input() title = 'Video Player';
  @Input() autoPlay = false;
  @Input() loop = false;
  @Input() muted = false;
  @Input() interrupts: VideoInterrupt[] = [];
  @Input() placeholderImage?: string;

  @Output() playEvent = new EventEmitter<void>();
  @Output() pauseEvent = new EventEmitter<void>();
  @Output() volumeChange = new EventEmitter<{ volume: number; isMuted: boolean }>();
  @Output() timeUpdate = new EventEmitter<{ currentTime: number; duration: number }>();
  @Output() fullscreenChange = new EventEmitter<boolean>();
  @Output() interruptActive = new EventEmitter<VideoInterrupt>();
  @Output() interruptDismiss = new EventEmitter<void>();
  @Output() ended = new EventEmitter<void>();

  // --- View Children ---
  @ViewChild('videoPlayer') private videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('playerContainer') private playerContainerRef!: ElementRef<HTMLDivElement>;

  // --- Component State ---
  public isPlaying = false;
  public currentTime = 0;
  public duration = 0;
  public volume = 1;
  public isMuted = false;
  public isFullScreen = false;
  public showControls = true;
  public hasPlayed = false;
  public currentInterrupt: VideoInterrupt | null = null;
  public isInterruptActive = false;
  
  public formatTime = formatTime; // Make utility function available in the template

  private seenInterrupts = new Set<string>();
  private controlsHideTimeout: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.isMuted = this.muted;
    this.volume = this.muted ? 0 : 1;
    this.videoRef.nativeElement.volume = this.volume;
  }

  ngOnDestroy(): void {
    clearTimeout(this.controlsHideTimeout);
  }

  // --- Event Handlers for Video Element ---
  onPlay(): void {
    this.isPlaying = true;
    this.hasPlayed = true;
    this.playEvent.emit();
    this.startControlsHideTimer();
  }

  onPause(): void {
    this.isPlaying = false;
    this.pauseEvent.emit();
    this.showControls = true;
    clearTimeout(this.controlsHideTimeout);
  }

  onTimeUpdate(): void {
    const video = this.videoRef.nativeElement;
    this.currentTime = video.currentTime;
    this.timeUpdate.emit({ currentTime: this.currentTime, duration: this.duration });

    if (!this.isInterruptActive) {
      for (const interrupt of this.interrupts) {
        if (
          this.currentTime >= interrupt.timestampSeconds &&
          this.currentTime < interrupt.timestampSeconds + 0.5 &&
          !this.seenInterrupts.has(interrupt.id)
        ) {
          video.pause();
          this.currentInterrupt = interrupt;
          this.isInterruptActive = true;
          this.seenInterrupts.add(interrupt.id);
          this.interruptActive.emit(interrupt);
          break;
        }
      }
    }
  }

  onLoadedMetadata(): void {
    this.duration = this.videoRef.nativeElement.duration;
  }

  onVolumeChange(): void {
    const video = this.videoRef.nativeElement;
    this.volume = video.volume;
    this.isMuted = video.muted;
    this.volumeChange.emit({ volume: this.volume, isMuted: this.isMuted });
  }

  onEnded(): void {
    this.isPlaying = false;
    if (!this.loop) {
      this.videoRef.nativeElement.currentTime = 0;
      this.hasPlayed = false;
    }
    this.seenInterrupts.clear();
    this.ended.emit();
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.isFullScreen = !!document.fullscreenElement;
    this.fullscreenChange.emit(this.isFullScreen);
  }

  // --- Control Functions ---
  togglePlayPause(): void {
    if (this.isInterruptActive) return;
    this.isPlaying ? this.videoRef.nativeElement.pause() : this.videoRef.nativeElement.play();
  }

  handleProgressSeek(event: MouseEvent): void {
    if (this.isInterruptActive) return;
    const progressBar = (event.currentTarget as HTMLElement);
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newProgress = (clickX / rect.width);
    this.videoRef.nativeElement.currentTime = newProgress * this.duration;
  }

  handleVolumeSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);
    this.videoRef.nativeElement.volume = newVolume;
    this.videoRef.nativeElement.muted = newVolume === 0;
  }

  toggleMute(): void {
    const video = this.videoRef.nativeElement;
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) {
      video.volume = 0.5;
    }
  }

  toggleFullScreen(): void {
    if (this.isFullScreen) {
      document.exitFullscreen();
    } else {
      this.playerContainerRef.nativeElement.requestFullscreen();
    }
  }

  dismissInterrupt(): void {
    this.isInterruptActive = false;
    this.currentInterrupt = null;
    this.interruptDismiss.emit();
    this.videoRef.nativeElement.play();
  }

  // --- UI Interaction ---
  @HostListener('mousemove')
  onMouseMove(): void {
    this.showControls = true;
    this.startControlsHideTimer();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.isPlaying) {
      this.showControls = false;
    }
  }

  private startControlsHideTimer(): void {
    clearTimeout(this.controlsHideTimeout);
    if (this.isPlaying) {
      this.controlsHideTimeout = setTimeout(() => {
        this.showControls = false;
        this.cdr.detectChanges();
      }, 3000);
    }
  }
}
