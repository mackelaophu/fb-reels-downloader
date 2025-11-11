# play_reels.sh
#!/bin/bash
cd "$(dirname "$0")"
mpv --loop-playlist --shuffle --fullscreen reels_download/*.mp4
