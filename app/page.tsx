"use client";

import type React from "react";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

function formatTime(time: number) {
  time = Math.trunc(time);
  let hours = Math.trunc(time / 3600);
  let minutes = Math.trunc((time - hours * 3600) / 60);
  let seconds = time % 60;

  let str = "";
  if (hours) {
    str += (hours < 10 ? `0${hours}` : hours) + ":";
  }

  str += (minutes < 10 ? `0${minutes}` : minutes) + ":";

  str += seconds < 10 ? `0${seconds}` : seconds;
  return str;
}

export default function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedURL, setSelectedURL] = useState("720p (HD)");
  const [videoLoading, setVideoLoading] = useState(false);

  const [videoDetails, setVideoDetails] = useState<null | {
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
    downloadLink: string;
    availableResolutions: any[];
  }>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (
    //   !url.trim() ||
    //   (!url.includes("youtube.com/") && !url.includes("youtu.be/"))
    // ) {
    //   setError("Please enter a valid YouTube URL");
    //   return;
    // }

    setError("");
    setLoading(true);

    // Simulate API call to fetch video details
    const res = await fetch("http://localhost:8080/video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
      }),
    });
    const data = await res.json();

    setLoading(false);
    setVideoDetails({
      title: data.title,
      thumbnail: data.thumbnail,
      duration: formatTime(data.duration),
      author: data.uploader,
      downloadLink: "test",
      availableResolutions: data.availableResolutions,
    });
  };

  const handleDownload = async () => {
    if (selectedURL) {
      setVideoLoading(true);
      const video_url = videoDetails?.availableResolutions.find(
        t => t.name === selectedURL
      )?.url;
      const res = await fetch("http://localhost:8080/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youtube_url: url,
          video_url: video_url,
        }),
      });
      const blob = await res.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = videoDetails?.title + ".mp4"; // or get from response headers
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(fileUrl);

      setVideoLoading(false);
    }
  };
  return (
    <div className="container max-w-3xl py-10 px-4 mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          FN7 YouTube Video Downloader
        </h1>
        <p className="text-muted-foreground">
          Enter a YouTube URL to download videos in various formats
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Download YouTube Video</CardTitle>
          <CardDescription>
            Paste the YouTube video URL and click "Analyze" to get download
            options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>

          {videoDetails && (
            <div className="mt-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative aspect-video w-full md:w-1/2 min-h-[200px] rounded-lg overflow-hidden">
                  <Image
                    src={videoDetails.thumbnail || "/placeholder.svg"}
                    alt={videoDetails.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                    {videoDetails.duration}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {videoDetails.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    By {videoDetails.author}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <Select defaultValue="mp4">
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mp4">MP4</SelectItem>
                          <SelectItem value="mp3">MP3 (Audio only)</SelectItem>
                          <SelectItem value="webm">WebM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quality</label>
                      <Select
                        value={selectedURL}
                        onValueChange={setSelectedURL}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          {videoDetails?.availableResolutions.map(
                            (resolution: any) => (
                              <SelectItem
                                key={resolution.name}
                                value={resolution.name}
                              >
                                {resolution.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                disabled={videoLoading}
                className="w-full"
              >
                {videoLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Now
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground"></CardFooter>
      </Card>
    </div>
  );
}
