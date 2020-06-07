import { Request, Response } from 'express';

import connection from '../database/connection';

class PointsController {
	async index(request: Request, response: Response): Promise<any> {
		const { city, uf, items } = request.query;

		const parsedItems = String(items)
			.split(',')
			.map(item => Number(item.trim()));

		const points = await connection('points')
			.join('point_items', 'points.id', '=', 'point_items.point_id')
			.whereIn('point_items.item_id', parsedItems)
			.where('city', String(city))
			.where('uf', String(uf))
			.distinct()
			.select('points.*');

		const serializedPoints = points.map(point => ({
			...point,
			image_url: `http://192.168.15.12:3333/uploads/${point.image}`,
		}));

		return response.json(serializedPoints);
	}

	async show(request: Request, response: Response): Promise<any> {
		const { id } = request.params;

		const point = await connection('points').where('id', id).first();

		if (!point) {
			return response.status(400).json({ message: 'Point not found.' });
		}

		const items = await connection('items')
			.join('point_items', 'items.id', '=', 'point_items.item_id')
			.where('point_items.point_id', id)
			.select('items.title');

		const serializedPoint = {
			...point,
			image_url: `http://192.168.15.12:3333/uploads/${point.image}`,
		};

		return response.json({ point: serializedPoint, items });
	}

	async create(request: Request, response: Response): Promise<any> {
		const { name, email, whatsapp, city, uf, latitude, longitude, items } = request.body;
		const { filename } = request.file;

		const trx = await connection.transaction();

		const point = {
			image: filename,
			name,
			email,
			whatsapp,
			city,
			uf,
			latitude,
			longitude,
		};
		const [point_id] = await trx('points').insert(point);

		const pointItems = items
			.split(',')
			.map((item_id: string) => ({ item_id: Number(item_id), point_id }));
		await trx('point_items').insert(pointItems);

		await trx.commit();

		return response.json({ id: point_id, ...point });
	}
}

export default PointsController;
