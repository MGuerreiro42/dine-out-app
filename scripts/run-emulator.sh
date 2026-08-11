#!/usr/bin/env bash
set -euo pipefail

# Local-machine quirk: newer cmdline-tools (avdmanager) write AVDs to
# ~/.config/.android/avd, but the `emulator` binary still defaults to the
# legacy ~/.android/avd unless told otherwise — without this, the AVD
# below "doesn't exist" even though `avdmanager list avd` sees it fine.
export ANDROID_AVD_HOME="${ANDROID_AVD_HOME:-$HOME/.config/.android/avd}"

AVD_NAME="${1:-dine_out_dev}"

# -gpu host: this machine has a real GPU (confirmed working via Mesa/radeonsi)
# — the emulator's default software renderer (swiftshader) is unnecessarily
# heavy and was observed to lock up the whole system under it.
exec "$ANDROID_HOME/emulator/emulator" -avd "$AVD_NAME" -gpu host
