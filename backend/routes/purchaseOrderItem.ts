import { Router, Request, Response } from 'express';
import { createPurchaseOrderItem, getPurchaseOrderItems, findPurchaseOrderItem, updatePurchaseOrderItem } from '../models/purchaseOrderItem';
import { checkLogin } from '../middleware';

const purchaseOrderItemRouter = Router();
purchaseOrderItemRouter.use(checkLogin);

purchaseOrderItemRouter.post('/', async (req: Request, res: Response) => {
    try {
        const purchaseOrderItem = await createPurchaseOrderItem(req.body);
        res.status(201).json(purchaseOrderItem);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

purchaseOrderItemRouter.get('/', async (req: Request, res: Response) => {
    try {
        const purchaseOrderItems = await getPurchaseOrderItems();
        res.status(200).json(purchaseOrderItems);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

purchaseOrderItemRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const purchaseOrderItem = await findPurchaseOrderItem({ id: parseInt(req.params.id) });
        if (!purchaseOrderItem) {
            res.status(404).json({ message: 'Purchase order item not found' });
            return;
        }
        res.status(200).json(purchaseOrderItem);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

purchaseOrderItemRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const purchaseOrderItem = await updatePurchaseOrderItem({ id: parseInt(req.params.id), ...req.body });
        if (!purchaseOrderItem) {
            res.status(404).json({ message: 'Purchase order item not found' });
            return;
        }
        res.status(200).json(purchaseOrderItem);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default purchaseOrderItemRouter;
