import axios from 'axios';

export default async function handler(req: any, res: any) {
    try {
        const response = await axios.post('http://localhost:3001/user/login', req.body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data || {});
    }
}