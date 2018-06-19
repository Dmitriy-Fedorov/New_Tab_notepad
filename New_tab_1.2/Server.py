import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import time
from tornado.options import define, options
from pynput.keyboard import Key, Controller, KeyCode
define("port", default=8888, help="run on the given port", type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", RootHandler),
            (r"/ws", WSHandler)
        ]
        settings = dict()
        tornado.web.Application.__init__(self, handlers, **settings)


class RootHandler(tornado.web.RequestHandler):
    def get(self):
        print("DimonGET:", self.request.remote_ip)
        self.write("Dimas " + self.request.remote_ip)

    def post(self):
        current_time = time.strftime("%d.%m.%Y %H:%M:%S", time.localtime())
        ip = self.request.remote_ip
        username = self.get_argument('username')
        action = self.get_argument('action')
        # self.redirect('/ws')
        print("{}: {}: POST: {} {}".format(current_time, ip, username, action))
        keyboard = Controller()
        if action == 'next':
            keyboard.press(KeyCode.from_vk(0xB0))
        elif action == 'prev':
            keyboard.press(KeyCode.from_vk(0xB1)) #0xB1 pause media
        elif action == 'hide':
            keyboard.press(Key.ctrl)
            keyboard.press(Key.space)
            keyboard.release(Key.ctrl)
            keyboard.release(Key.space)
        elif action == "log":
            keyboard.type('Hello World')
        self.write("{}: Wow {} {}".format(ip, username,  action))


class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        current_time = time.strftime("%d.%m.%Y %H:%M:%S", time.localtime())
        print("{}: WebSocket opened {}".format(current_time, self.request.remote_ip))
        with open('data.txt', 'r', encoding='utf-8') as infile:
            text = ""
            for line in infile:
                text += line
        self.write_message(text)
        # print(text)

    def on_message(self, message):
        current_time = time.strftime("%d.%m.%Y %H:%M:%S", time.localtime())
        print("{}: {} MESSAGE: {}".format(current_time, self.request.remote_ip, message))
        # self.write_message(u"Your message was: " + message)
        if message == 'GET':
            with open('data.txt', 'r', encoding='utf-8') as infile:
                text = ""
                for line in infile:
                    text += line
            self.write_message(text)
        else:
            with open('data.txt', 'w', encoding='utf-8') as infile:
                infile.write(message)

    def on_close(self):
        current_time = time.strftime("%d.%m.%Y %H:%M:%S", time.localtime())
        print("{}: WebSocket closed {}".format(current_time, self.request.remote_ip))

    def mes(self, mes):
        self.write(mes)


def main():
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()
