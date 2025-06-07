import { Router, Request, Response } from 'express';
import { createPurchaseOrder, getPurchaseOrders, findPurchaseOrder, updatePurchaseOrder } from '../models/purchaseOrder';
import { requireClerk } from '../middleware';

const purchaseOrderRouter = Router();
purchaseOrderRouter.use(requireClerk);

purchaseOrderRouter.post('/', async (req: Request, res: Response) => {
    try {
        const purchaseOrder = await createPurchaseOrder(req.body);
        res.status(201).json(purchaseOrder);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

purchaseOrderRouter.get('/', async (req: Request, res: Response) => {
    try {
        const purchaseOrders = await getPurchaseOrders();
        res.status(200).json(purchaseOrders);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

purchaseOrderRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const purchaseOrder = await findPurchaseOrder({ id: parseInt(req.params.id) });
        if (!purchaseOrder) {
            res.status(404).json({ message: 'Purchase order not found' });
            return;
        }
        res.status(200).json(purchaseOrder);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

purchaseOrderRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const purchaseOrder = await updatePurchaseOrder({ id: parseInt(req.params.id), ...req.body });
        if (!purchaseOrder) {
            res.status(404).json({ message: 'Purchase order not found' });
            return;
        }
        res.status(200).json(purchaseOrder);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default purchaseOrderRouter;
