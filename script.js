/*
	AI v 0.0.1
    Copyright (C) 2017 Guest

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/
*/

/*
	Память представлена в виде замкнутого кольца
	кадров и двух головок - считывающей и
	записывающей, движущихся в одном направлении
	но с разной скоростью. Задача записывающей
	головки последовательно сохранять входную
	информацию. Задача считывающей определить,
	которое событие наиболее вероятно в данный
	момент и выдать в качестве ответной реакции
	следующее по порядку событие.
	Более наглядно рабту программы демонстрирует
	посследовательный цикличный ввод нескольких
	цифр, например 1, 2, 3.
	
	Техническая информация:
		'<' - введённое сообщение
		'>' - ответ бота
		"no thought" - ответная реакция не найдена.
	
	Записывающую головку представляет функция
	write_round,а её позицию переменная
	frame_counter
	Считывающую головку представляет функция
	read_round,а её позицию переменная
	current_position
*/

MEMORY_SIZE = 1024
memory = [MEMORY_SIZE]

/*
	Принцип работы построен на 2-х закономерностях:
		1.	Все события последовательны
		2.	События циклично повторяются

	При беседе с ботом, я не рекомендую повторять
	диалог сначала. Лучше продолжать монолог, как
	если бы вы общались с молчаливым собеседником.
	После достижения критической массы словарного
	запаса, бот станет отвечать более корректно.
	
	Возможно усложнение программы включением 3-х
	составляющих:
		1.	Поиск событий в бесконечном цикле с
			уменьшением точности их сравнения.
		2.	Обработка сразу нескольких типов
			информации, представление кадра как
			ассоциации.
		3.	Селекция ответной реакции по
			метаинформации о потребностях и
			степени их удовлетворения этой
			реакцией.
	
	То есть усложнение бота предполагает
	добавление ему "органов чувств", потребностей,
	возможности совершать ошибки.
	
	Представленный ниже код, это базовый скелет с
	минимальным набором возможностей, расширение
	которых предполагает только изменение функции
	сравнения событий и их дополнение избыточной
	информацией.
*/

current_position	= 0
frame_counter		= 0

function brain(event)
{
	start = current_position
	answer = "no thought"
	
	/*
		Считывающая головка движется по кольцу памяти
		пока не вернётся в точку старта или не
		встретит совпадение событий. В противном
		случае цикл станет бесконечным.
	*/
	
	do
	{
		if(memory[current_position] == event)//Место функции сравнения событий
		{
			if(current_position < MEMORY_SIZE - 1)
				current_position++
			else
				current_position = 0
			
			answer = memory[current_position]
			break
		}
		
			if(current_position < MEMORY_SIZE - 1)
				current_position++
			else
				current_position = 0
	}
	while(current_position != start)
	
	if(frame_counter < MEMORY_SIZE - 1)
		frame_counter++
	else
		frame_counter = 0

	memory[frame_counter] = event
	
	return answer
}

//Обработка событий интерфейса

function InputOnKeyUp()
{
	if(window.event.keyCode == 13)
	{
		if(input.value == 'del')
		{
			DeleteAll()
			return
		}
		
		LoadAll()
		
		output.value += '<  ' + input.value + '\r\n'
		output.value += '>  ' + brain(input.value) + '\r\n'
		input.value = ''
		output.scrollTop = output.scrollHeight
		
		SaveAll()
	}
}

//Функции управления памятью
function SaveAll()
{
	for(i = 0; i < MEMORY_SIZE; i++)
		localStorage.setItem(i, memory[i])
}

function LoadAll()
{
	for(i = 0; i < MEMORY_SIZE; i++)
		memory[i] = localStorage.getItem(i)
}

function DeleteAll()
{
	localStorage.clear()
	memory.length = 0
	alert("Memory has been cleaned.")
	output.value = ''
	input.value = ''
}