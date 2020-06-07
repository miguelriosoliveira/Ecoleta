import { Request, Response } from 'express';

import connection from '../database/connection';

class ItemsController {
	async index(requrequest: Request, response: Response): Promise<any> {
		const items = await connection('items').select('*');

		const serializedItems = items.map(item => ({
			...item,
			image_url: `http://192.168.15.12:3333/uploads/${item.image}`,
		}));

		return response.json(serializedItems);
	}
}

export default ItemsController;
