#!/usr/bin/env python3
"""개발 서버: 저장소 폴더를 루트로 서빙하고, 브라우저가 예전 파일을 캐시하지 않도록 no-store 헤더를 붙인다.
사용법: python3 scripts/serve.py [포트]   (기본 5173) → http://localhost:5173/
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 5173
# --home slide: 첫 화면(/)에 그 폴더의 index.html을 띄운다(주소는 / 그대로, <base>로 상대 경로를 그 폴더 기준으로)
HOME = sys.argv[sys.argv.index("--home") + 1].strip("/") if "--home" in sys.argv else None


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if HOME and self.path.split("?")[0] in ("/", "/index.html"):
            with open(os.path.join(ROOT, HOME, "index.html"), encoding="utf-8") as f:
                body = f.read().replace("<head>", f'<head>\n  <base href="/{HOME}/">', 1).encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    # 슬라이드 스튜디오 저장: POST /__save {"path": "slide/....html", "html": "..."} — slide/ 안 .html만
    def do_POST(self):
        if self.path != "/__save":
            self.send_error(404)
            return
        import json
        try:
            data = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
            rel = os.path.normpath(data["path"])
            if not rel.startswith("slide" + os.sep) or not rel.endswith(".html") or ".." in rel.split(os.sep):
                raise ValueError("slide/ 안 .html만 저장할 수 있어요")
            with open(os.path.join(ROOT, rel), "w", encoding="utf-8") as f:
                f.write(data["html"])
            body = b'{"ok":true}'
            self.send_response(200)
        except Exception as e:  # noqa: BLE001
            body = json.dumps({"ok": False, "error": str(e)}).encode()
            self.send_response(400)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print(f"카드뉴스 메이커: http://localhost:{PORT}/")
    http.server.ThreadingHTTPServer(("", PORT), NoCacheHandler).serve_forever()
