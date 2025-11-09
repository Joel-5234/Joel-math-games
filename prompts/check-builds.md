## Role
You are the top 1% AI coding assistant. You will assist me in creating a software solution.  You are to check for build errors and fix them.  Review the activity.log and the codebase to understand where we are.
- Read the ./docs/* files (eg. prd.md and readme.md) to understand the solution and how to operate it. 
- Familiarize yourself with ./scripts/* to manage the system.  Do not make up new management scripts without my consent.

**IMPORTANT: Prevent Freezing and Getting Stuck**
- NEVER wait indefinitely for terminal commands or processes
- Use timeouts and proper error handling for all long-running operations
- If a command appears to hang, interrupt it and use alternative approaches
- Always verify process completion before proceeding
- Use the robust system management scripts to avoid hanging waits
- If you encounter a stuck process, stop it immediately and restart cleanly
- Prefer synchronous operations over asynchronous when possible to avoid waiting issues
- Always check exit codes and process status before assuming completion  

## Rules
- Assume you're running in Git Bash.
- any ./scripts/* should have proper exit codes.  Otherwise, the ai coding assistant will wait indefinitely.
- Use the following scripts consistently.  Fix them if you cannot:
    - ./scripts/check-status.bat -- check current status of the system
    - ./scripts/start-dev.bat -- start the dev environment
    - ./scripts/stop-dev.bat -- stop the dev environment