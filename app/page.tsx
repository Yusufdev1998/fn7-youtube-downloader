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

export default function YouTubeDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState<null | {
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
  }>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !url.trim() ||
      (!url.includes("youtube.com/") && !url.includes("youtu.be/"))
    ) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate API call to fetch video details
    setTimeout(() => {
      setLoading(false);
      setVideoDetails({
        title: "How to Build a Next.js Application",
        thumbnail: "/placeholder.svg?height=720&width=1280",
        duration: "10:42",
        author: "Coding Tutorials",
      });
    }, 1500);
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
                <div className="relative aspect-video w-full md:w-1/2 rounded-lg overflow-hidden">
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
                      <Select defaultValue="720p">
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1080p">1080p HD</SelectItem>
                          <SelectItem value="720p">720p HD</SelectItem>
                          <SelectItem value="480p">480p</SelectItem>
                          <SelectItem value="360p">360p</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Now
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <p>This is a demo interface only</p>
          <p>No videos are actually downloaded</p>
        </CardFooter>
      </Card>
    </div>
  );
}
