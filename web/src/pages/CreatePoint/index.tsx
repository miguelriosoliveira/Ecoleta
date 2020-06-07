import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import logo from '../../assets/logo.svg';
import Dropzone from '../../components/Dropzone';
import api from '../../services/api';

import './styles.css';

interface ItemProps {
	id: number;
	title: string;
	image_url: string;
}

interface UFProps {
	sigla: string;
	nome: string;
}

interface CityProps {
	id: number;
	nome: string;
}

const CreatePoint: React.FC = () => {
	const [items, setItems] = useState<ItemProps[]>([]);
	const [ufList, setUfList] = useState<UFProps[]>([]);
	const [selectedUf, setSelectedUf] = useState('0');
	const [cities, setCities] = useState<CityProps[]>([]);
	const [selectedCity, setSelectedCity] = useState('0');
	const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
	const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
	const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [selectedImage, setSelectedImage] = useState<File>();

	const history = useHistory();

	useEffect(() => {
		api.get<ItemProps[]>('items').then(response => setItems(response.data));

		axios
			.get<UFProps[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados', {
				params: { orderBy: 'nome' },
			})
			.then(response => setUfList(response.data));

		navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
			setInitialPosition([latitude, longitude]);
		});
	}, []);

	useEffect(() => {
		if (selectedUf === '0') {
			return;
		}

		axios
			.get<CityProps[]>(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
				{ params: { orderBy: 'nome' } },
			)
			.then(response => setCities(response.data));
	}, [selectedUf]);

	function handleSelectUf(event: ChangeEvent<HTMLSelectElement>): void {
		const uf = event.target.value;
		setSelectedUf(uf);
	}

	function handleSelectCity(event: ChangeEvent<HTMLSelectElement>): void {
		const city = event.target.value;
		setSelectedCity(city);
	}

	function handleMapClick({ latlng: { lat, lng } }: LeafletMouseEvent): void {
		setSelectedPosition([lat, lng]);
	}

	function handleInputChange({ target: { name, value } }: ChangeEvent<HTMLInputElement>): void {
		setFormData({ ...formData, [name]: value });
	}

	function handleSelectItem(id: number): void {
		if (selectedItems.includes(id)) {
			setSelectedItems(selectedItems.filter(itemId => itemId !== id));
		} else {
			setSelectedItems([...selectedItems, id]);
		}
	}

	async function handleSubmit(event: FormEvent): Promise<void> {
		event.preventDefault();

		const { name, email, whatsapp } = formData;
		const [latitude, longitude] = selectedPosition;

		const data = new FormData();
		data.append('name', name);
		data.append('email', email);
		data.append('whatsapp', whatsapp);
		data.append('latitude', String(latitude));
		data.append('longitude', String(longitude));
		data.append('uf', selectedUf);
		data.append('city', selectedCity);
		data.append('items', selectedItems.join(','));

		if (selectedImage) {
			data.append('image', selectedImage);
		}

		await api.post('points', data);

		alert('Ponto de coleta cadastrado!');

		history.push('/');
	}

	return (
		<div id="page-create-point">
			<header>
				<img src={logo} alt="Ecoleta logo" />
				<Link to="/">
					<FiArrowLeft />
					Voltar para Home
				</Link>
			</header>

			<form onSubmit={handleSubmit}>
				<h1>
					Cadastro do
					<br />
					ponto de coleta
				</h1>

				<Dropzone onUpload={setSelectedImage} />

				<fieldset>
					<legend>
						<h2>Dados</h2>
					</legend>

					<div className="field">
						<label htmlFor="name">Nome da entidade</label>
						<input
							type="text"
							name="name"
							id="name"
							value={formData.name}
							onChange={handleInputChange}
						/>
					</div>

					<div className="field-group">
						<div className="field">
							<label htmlFor="email">E-mail</label>
							<input
								type="email"
								name="email"
								id="email"
								value={formData.email}
								onChange={handleInputChange}
							/>
						</div>

						<div className="field">
							<label htmlFor="whatsapp">WhatsApp</label>
							<input
								type="text"
								name="whatsapp"
								id="whatsapp"
								value={formData.whatsapp}
								onChange={handleInputChange}
							/>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Endereço</h2>
						<span>Selecione o endereço no mapa</span>
					</legend>

					<Map center={initialPosition} zoom={15} onClick={handleMapClick}>
						<TileLayer
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={selectedPosition} />
					</Map>

					<div className="field-group">
						<div className="field">
							<label htmlFor="uf">Estado (UF)</label>
							<select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
								<option value="0">Selecione um estado...</option>
								{ufList.map(uf => (
									<option key={uf.sigla} value={uf.sigla}>
										{uf.nome}
									</option>
								))}
							</select>
						</div>

						<div className="field">
							<label htmlFor="city">Cidade</label>
							<select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
								<option value="0">Selecione uma cidade...</option>
								{cities.map(city => (
									<option key={city.id} value={city.nome}>
										{city.nome}
									</option>
								))}
							</select>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Itens de coleta</h2>
						<span>Selecione um ou mais itens abaixo</span>
					</legend>

					<ul className="items-grid">
						{items.map(item => (
							<li
								key={item.id}
								onClick={() => handleSelectItem(item.id)}
								className={selectedItems.includes(item.id) ? 'selected' : ''}
							>
								<img src={item.image_url} alt={item.title} />
								<span>{item.title}</span>
							</li>
						))}
					</ul>
				</fieldset>

				<button type="submit">Cadastrar ponto de coleta</button>
			</form>
		</div>
	);
};

export default CreatePoint;
