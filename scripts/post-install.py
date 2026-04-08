import subprocess

try:
    result = subprocess.run(
        [
            "uv",
            "run",
            "patch/main.py",
            "webview",
            "--install-name",
            "pywebview",
            "--apply",
        ]
    )
    print(result)
except subprocess.CalledProcessError as e:
    print(e)
