import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';

import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';

import api from '../../services/api';

import styles from './styles';

interface ItemProps {
	id: number;
	title: string;
	image_url: string;
}

interface PointProps {
	id: number;
	image_url: string;
	name: string;
	latitude: number;
	longitude: number;
}

interface RouteParams {
	uf: string;
	city: string;
}

const Points: React.FC = () => {
	const [items, setItems] = useState<ItemProps[]>([]);
	const [points, setPoints] = useState<PointProps[]>([]);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

	const route = useRoute();
	const routeParams = route.params as RouteParams;

	// get items and current position
	useEffect(() => {
		// get items
		api.get<ItemProps[]>('items').then(response => setItems(response.data));

		// get current position
		async function loadPosition(): Promise<void> {
			const { status } = await Location.requestPermissionsAsync();

			if (!status) {
				Alert.alert('Oooops...', 'Precisamos de uma permissão para obter sua localização');
				return;
			}

			const location = await Location.getCurrentPositionAsync();
			const { latitude, longitude } = location.coords;
			setInitialPosition([latitude, longitude]);
		}
		loadPosition();
	}, []);

	// get points
	useEffect(() => {
		api
			.get<PointProps[]>('points', {
				params: { city: routeParams.city, uf: routeParams.uf, items: selectedItems },
			})
			.then(response => setPoints(response.data));
	}, [routeParams.city, routeParams.uf, selectedItems]);

	const navigation = useNavigation();

	function handleNavigateBack(): void {
		navigation.goBack();
	}

	function handleNavigateToDetail(pointId: number): void {
		navigation.navigate('Detail', { pointId });
	}

	function handleSelectItem(id: number): void {
		if (selectedItems.includes(id)) {
			setSelectedItems(selectedItems.filter(itemId => itemId !== id));
		} else {
			setSelectedItems([...selectedItems, id]);
		}
	}

	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity style={styles.button} onPress={handleNavigateBack}>
					<Icon name="log-out" size={20} color="#34cb79" style={styles.buttonIcon} />
				</TouchableOpacity>

				<Text style={styles.title}>Bem vindo.</Text>
				<Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

				<View style={styles.mapContainer}>
					{initialPosition[0] !== 0 && (
						<MapView
							style={styles.map}
							initialRegion={{
								latitude: initialPosition[0],
								longitude: initialPosition[1],
								latitudeDelta: 0.014,
								longitudeDelta: 0.014,
							}}
							loadingEnabled={initialPosition[0] === 0}
						>
							{points.map(point => (
								<Marker
									key={String(point.id)}
									coordinate={{ latitude: point.latitude, longitude: point.longitude }}
									style={styles.mapMarker}
									onPress={() => handleNavigateToDetail(point.id)}
								>
									<View style={styles.mapMarkerContainer}>
										<Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
										<Text style={styles.mapMarkerTitle}>{point.name}</Text>
									</View>
								</Marker>
							))}
						</MapView>
					)}
				</View>
			</View>

			<View style={styles.itemsContainer}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.itemsScroll}
				>
					{items.map(item => (
						<TouchableOpacity
							key={String(item.id)}
							style={[styles.item, selectedItems.includes(item.id) ? styles.selectedItem : {}]}
							activeOpacity={0.6}
							onPress={() => handleSelectItem(item.id)}
						>
							<SvgUri width={42} height={42} uri={item.image_url} />
							<Text style={styles.itemTitle}>{item.title}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</>
	);
};

export default Points;
