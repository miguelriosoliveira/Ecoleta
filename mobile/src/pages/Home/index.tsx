import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';

import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import homeBackground from '../../assets/home-background.png';
import logo from '../../assets/logo.png';

import styles from './styles';

interface UFProps {
	sigla: string;
	nome: string;
}

interface CityProps {
	id: number;
	nome: string;
}

const Home: React.FC = () => {
	const navigation = useNavigation();

	const [ufList, setUfList] = useState<UFProps[]>([]);
	const [selectedUf, setSelectedUf] = useState(null);
	const [cities, setCities] = useState<CityProps[]>([]);
	const [selectedCity, setSelectedCity] = useState(null);

	useEffect(() => {
		axios
			.get<UFProps[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados', {
				params: { orderBy: 'nome' },
			})
			.then(response => setUfList(response.data));
	}, []);

	useEffect(() => {
		setSelectedCity(null);

		if (!selectedUf) {
			return;
		}

		axios
			.get<CityProps[]>(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
				{ params: { orderBy: 'nome' } },
			)
			.then(response => setCities(response.data));
	}, [selectedUf]);

	function handleNavigateToPoints(): void {
		if (!selectedUf || !selectedCity) {
			Alert.alert('Localidade', 'Antes de prosseguir, precisamos que escolha localidade desejada');
			return;
		}
		navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
	}

	return (
		<ImageBackground
			source={homeBackground}
			style={styles.container}
			imageStyle={{ width: 274, height: 368 }}
		>
			<View style={styles.main}>
				<Image source={logo} />
				<Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
				<Text style={styles.description}>
					Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
				</Text>
			</View>

			<RNPickerSelect
				items={ufList.map(uf => ({ label: uf.nome, value: uf.sigla }))}
				placeholder={{ label: 'Selecione seu estado...', value: null, color: 'gray' }}
				onValueChange={value => setSelectedUf(value)}
			/>

			{selectedUf && (
				<RNPickerSelect
					items={cities.map(city => ({ label: city.nome, value: city.nome }))}
					placeholder={{ label: 'Selecione sua cidade...', value: null, color: 'gray' }}
					onValueChange={value => setSelectedCity(value)}
				/>
			)}

			<View style={styles.footer}>
				<RectButton
					style={[styles.button, !selectedUf || !selectedCity ? styles.buttonDisabled : {}]}
					onPress={handleNavigateToPoints}
				>
					<View style={styles.buttonIcon}>
						<Icon name="log-in" color="#fff" size={24} />
					</View>

					<Text style={styles.buttonText}>Entrar</Text>
				</RectButton>
			</View>
		</ImageBackground>
	);
};

export default Home;
