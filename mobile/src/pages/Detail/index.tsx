import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

import styles from './styles';

interface PointProps {
	point: {
		image_url: string;
		name: string;
		whatsapp: string;
		email: string;
		city: string;
		uf: string;
		latitude: number;
		longitude: number;
	};
	items: {
		title: string;
	}[];
}
interface RouteParams {
	pointId: number;
}

const Detail: React.FC = () => {
	const [point, setPoint] = useState<PointProps>({} as PointProps);
	const route = useRoute();
	const routeParams = route.params as RouteParams;

	useEffect(() => {
		api.get<PointProps>(`points/${routeParams.pointId}`).then(response => setPoint(response.data));
	}, [routeParams.pointId]);

	const navigation = useNavigation();

	function handleNavigateBack(): void {
		navigation.goBack();
	}

	function handleWhatsapp(): void {
		Linking.openURL(
			`whatsapp://send?phone=${point.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`,
		);
	}

	function handleComposeMail(): void {
		MailComposer.composeAsync({
			subject: 'Interesse em coleta de resíduos',
			recipients: [point.point.email],
		});
	}

	if (!point.point) {
		return null;
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.body}>
				<TouchableOpacity onPress={handleNavigateBack}>
					<Icon name="arrow-left" size={20} color="#34cb79" />
				</TouchableOpacity>

				<Image style={styles.pointImage} source={{ uri: point.point.image_url }} />

				<Text style={styles.pointName}>{point.point.name}</Text>
				<Text style={styles.pointItems}>{point.items.map(item => item.title).join(', ')}</Text>

				<View style={styles.address}>
					<Text style={styles.addressTitle}>Endereço</Text>
					<Text style={styles.addressContent}>{`${point.point.city} / ${point.point.uf}`}</Text>
				</View>
			</View>

			<View style={styles.footer}>
				<RectButton style={styles.button} onPress={handleWhatsapp}>
					<FontAwesome name="whatsapp" size={20} color="#fff" />
					<Text style={styles.buttonText}>Whatsapp</Text>
				</RectButton>

				<RectButton style={styles.button} onPress={handleComposeMail}>
					<Icon name="mail" size={20} color="#fff" />
					<Text style={styles.buttonText}>E-mail</Text>
				</RectButton>
			</View>
		</SafeAreaView>
	);
};

export default Detail;
