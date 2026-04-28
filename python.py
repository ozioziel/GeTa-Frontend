import tkinter
from tkinter.constants import *

listaNum= []


def añadirNum(x):
    listaNum.append(x)

def updateLabel(label):
    label.config(text = str(listaNum))
    return label.cget("text") 

GameOver = False

tk = tkinter.Tk()

frame = tkinter.Frame(tk, relief=RIDGE, borderwidth=2)
frame.pack(fill=BOTH, expand=1)

label = tkinter.Label(frame, text="Hello, World")
label.pack(fill=X, expand=1)

button1 = tkinter.Button(frame, text="1", command= añadirNum(1))
button1.pack(side=TOP)
button2 = tkinter.Button(frame, text="2", command=tk.destroy)
button2.pack(side=TOP)
button3 = tkinter.Button(frame, text="3", command=tk.destroy)
button3.pack(side=TOP)
button4 = tkinter.Button(frame, text="4", command=tk.destroy)
button4.pack(side=TOP)
button5 = tkinter.Button(frame, text="5", command=tk.destroy)
button5.pack(side=TOP)
button6 = tkinter.Button(frame, text="6", command=tk.destroy)
button6.pack(side=TOP)
button7 = tkinter.Button(frame, text="7", command=tk.destroy)
button7.pack(side=TOP)
button8 = tkinter.Button(frame, text="8", command=tk.destroy)
button8.pack(side=TOP)
button9 = tkinter.Button(frame, text="9", command=tk.destroy)
button9.pack(side=TOP)
buttonSuma = tkinter.Button(frame, text="suma", command=tk.destroy)
buttonSuma.pack(side=TOP)
button = tkinter.Button(frame, text="Exit", command=tk.destroy)
button.pack(side=BOTTOM)

updateLabel(label)

tk.mainloop()


