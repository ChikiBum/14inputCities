/* eslint-disable arrow-parens */
'use strict';

const dropdownListsDefault = document.querySelector('.dropdown-lists__list--default'),
	dropdownListsSelect = document.querySelector('.dropdown-lists__list--select'),
	dropdownListsAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
	selectCities = document.getElementById('select-cities'),
	closeButton = document.querySelector('.close-button'),
	button = document.querySelector('.button'),
	label = document.querySelector('.label');

// initCities

const initCities = () => {
	button.style.display = 'none';

	fetch(`./db_cities.json`)
		.then(response => {
			if (response.status !== 200) {
			// console.log('fetch2:', response.status)
				throw new Error('Custom1 error: status network not 200');
			}
			return response.json();
		}).then(data => {
			const finalData = data.EN;
			// console.log(finalData)
			dropdownListsDefault.innerHTML = '';

			finalData.forEach(element => {
				const div = document.createElement('div'),
					divCol = document.createElement('div');
				div.classList.add('dropdown-lists__countryBlock');
				divCol.classList.add('dropdown-lists__col');
								div.insertAdjacentHTML('beforeend',
					`<div class="dropdown-lists__total-line">
                    <div class="dropdown-lists__country">${element.country}</div>
                    <div class="dropdown-lists__count">${element.count}</div>
                </div>`
				);
				divCol.append(div);

				const cities = element.cities,
					dst = [];
				// Для отбора городов с самым большим населением
				for (const key in cities) {
					dst.push({
						key: +key,
						value: +finalData[0].cities[key].count
					});
				}

				// Сортировка массива по убыванию населения
				dst.sort((a, b) => {
					if (a.value > b.value) {
						return -1;
					}
					if (a.value < b.value) {
						return 1;
					}
					return 0;
				});

				//фильтрация городов, оставляем только три с самым большим населением
				const filtСities = cities.filter((city, index) => {
					let returnCity = null;
					dst.slice(0, 3).forEach(element => {
						if (element.key === index) {
							returnCity = city;
						}
					});
					if (returnCity) {
						return returnCity;
					}
				});

				filtСities.forEach(el => {
					div.insertAdjacentHTML('beforeend',
						`<div class="dropdown-lists__line">
                        <div class="dropdown-lists__city dropdown-lists__city--ip">${el.name}</div>
                        <div class="dropdown-lists__count">${el.count}</div>
                    </div>`
					);
				});
				dropdownListsDefault.append(divCol);
			});

		})
		.catch(error => console.log('fetch2:', error));
};

initCities();

//dropdown cities dropdownCities
const dropdownCities = (country) => {

	fetch(`./db_cities.json`)
		.then(response => {
			if (response.status !== 200) {
				// console.log('fetch2:', response.status)
				throw new Error('Custom2 error: status network not 200');
			}
			return response.json();
		}).then(data => {
			const finalData = data.EN;
			// console.log(finalData);

			finalData.forEach(element => {
				if (element.country === country) {
					dropdownListsSelect.innerHTML = '';

					const div = document.createElement('div'),
						divCol = document.createElement('div');
						div.classList.add('dropdown-lists__countryBlock');
						divCol.classList.add('dropdown-lists__col');
										div.insertAdjacentHTML('beforeend',
							`<div class="dropdown-lists__total-line">
							<div class="dropdown-lists__country">${element.country}</div>
							<div class="dropdown-lists__count">${element.count}</div>
						</div>`
						);
						divCol.append(div);

						const cities = element.cities,
							dst = [];
						// Для отбора городов с самым большим населением
						for (const key in cities) {
							dst.push({
								key: +key,
								value: +finalData[0].cities[key].count
							});
						}

						// Сортировка массива по убыванию населения
						dst.sort((a, b) => {
							if (a.value > b.value) {
								return -1;
							}
							if (a.value < b.value) {
								return 1;
							}
							return 0;
						});

						//фильтрация городов, оставляем только три с самым большим населением
						const filtСities = cities.filter((city, index) => {
							let returnCity = null;
							dst.forEach(element => {
								if (element.key === index) {
									returnCity = city;
								}
							});
							if (returnCity) {
								return returnCity;
							}
						});

						filtСities.forEach(el => {
							div.insertAdjacentHTML('beforeend',
								`<div class="dropdown-lists__line">
								<div class="dropdown-lists__city dropdown-lists__city--ip">${el.name}</div>
								<div class="dropdown-lists__count">${el.count}</div>
							</div>`
							);
						});
					dropdownListsSelect.append(divCol);
				}
			});

		})
		.catch(error => console.log('fetch2:', error));
};

//заполнение инпута при клике
const autocompleteCities = (inputValue) => {
	label.style.top = '-25px';
	label.style.left = '0';
	label.style.color = '#00416A';  

	dropdownListsAutocomplete.innerHTML = '';
	fetch(`./db_cities.json`)
		.then(response => {
			if (response.status !== 200) {
				throw new Error('Custom3 error: status network not 200');
			}
			return response.json();
		}).then(data => {
			const finalData = data.EN,
				dst = [];

			const div = document.createElement('div'),
			divCol = document.createElement('div');
			div.classList.add('dropdown-lists__countryBlock');
			divCol.classList.add('dropdown-lists__col');
			divCol.append(div);

			finalData.forEach((element, i) => {
			const cities = element.cities;

			// выбор нужного города, при клике заполнили 
			for (const key in cities) {
						if (finalData[i].cities[key].name.substring(0, inputValue.length).toLowerCase() === inputValue.toLowerCase()) {
						dst.push({
							key: +key,
							name: finalData[i].cities[key].name,
							value: +finalData[i].cities[key].count
						});
					}
				}
			});

			// Сортировка массива по убыванию населения
			dst.sort((a, b) => {
				if (a.value > b.value) {
					return -1;
				}
				if (a.value < b.value) {
					return 1;
				}
				return 0;
			});

			if (dst.length > 0) {
				dst.forEach(el => {
					div.insertAdjacentHTML('beforeend',
						`<div class="dropdown-lists__line">
						<div class="dropdown-lists__city dropdown-lists__city--ip">${el.name}</div>
						<div class="dropdown-lists__count">${el.value}</div>
					</div>`
					);
				});
			} else {
				div.textContent = '"Ничего не найдено"...';
			}
		dropdownListsAutocomplete.append(divCol);
		})
	.catch(error => console.log('fetch3:', error));
};

//активация кнопки, добавление в кнопку линка 
const autofillLink = (clickValue) => {
			
	fetch(`./db_cities.json`)
		.then(response => {
			if (response.status !== 200) {
				throw new Error('Custom3 error: status network not 200');
			}
			return response.json();
		}).then(data => {
			const finalData = data.EN,
				dst = [];

			finalData.forEach((element, i) => {
			const cities = element.cities;

			// Для отбора соответсвующего инпуту
			for (const key in cities) {
						if (finalData[i].cities[key].name.substring(0, clickValue.length).toLowerCase() === clickValue.toLowerCase()) {
						dst.push({
							key: +key,
							name: finalData[i].cities[key].name,
							value: +finalData[i].cities[key].count,
							link: finalData[i].cities[key].link,
						});
					}
				}
			});
	
			button.href = `${dst[0].link}`;
			button.style.display = 'block';
		})
	.catch(error => console.log('fetch4:', error));
};

document.addEventListener('click', (event) => {
	const target = event.target,
		dropdownTotal = document.querySelectorAll('.dropdown-lists__total-line'),
		dropdownListsCity = document.querySelectorAll('.dropdown-lists__city');

	//Заполнение инпута при клике
	if (target.classList.contains('dropdown-lists__city')) {
		dropdownListsCity.forEach(elem => {
			if (target === elem) {
				selectCities.value = elem.textContent;

				selectCities.focus();
			
				dropdownListsDefault.style.display = 'none';
				dropdownListsSelect.style.display = 'none';
				dropdownListsAutocomplete.style.display = 'block';
				closeButton.style.display = 'block';

				autocompleteCities(elem.textContent);
				autofillLink(elem.textContent);

				closeButton.style.display = 'block';
				return;
			}
		});
	}

	
	if (target.closest('.dropdown-lists__list--default')) {
		dropdownTotal.forEach(elem => {
			if (elem === target.closest('.dropdown-lists__total-line')) {
				const elemCountry = elem.querySelector('.dropdown-lists__country'),
					contry = elemCountry.textContent;

				dropdownListsSelect.style.display = 'block';
				dropdownCities(contry);
			}
		});
	} else if (target.closest('.dropdown-lists__list--select')) {
		dropdownTotal.forEach(elem => {
			if (elem === target.closest('.dropdown-lists__total-line'))
			{
				dropdownListsSelect.style.display = '';
			}
		});
	} else if (target.classList.contains('label') || target.id === 'select-cities') {
		dropdownListsAutocomplete.innerHTML = '';
		dropdownListsDefault.style.display = 'none';
		dropdownListsSelect.style.display = 'none';
		dropdownListsAutocomplete.style.display = 'block';
		// dropdownListsAutocomplete.textContent = '"Ничего не найдено..."';
	} else if (target.classList.contains('close-button')){
		dropdownListsDefault.style.display = 'block';
		dropdownListsAutocomplete.style.display = 'none';
		dropdownListsAutocomplete.style.display = 'none';
		selectCities.value = '';
		closeButton.style.display = 'none';
		label.style = '';
		button.style.display = 'none';
	}
});

selectCities.addEventListener('input', function() {
	
	this.value = this.value.replace(/[а-яА-ЯёЁ\d]/g, '');
	if (selectCities.value.length > 0) {
		dropdownListsDefault.style.display = 'none';
		dropdownListsAutocomplete.style.display = 'block';
		closeButton.style.display = 'block';
		autocompleteCities(selectCities.value);
	} else {
		button.style.display = 'none';
		dropdownListsDefault.style.display = 'block';
		dropdownListsAutocomplete.style.display = 'none';
		closeButton.style.display = 'none';
	}
});
