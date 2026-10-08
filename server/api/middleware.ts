import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.ts';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 characters before starting the server.');
  }
  return secret;
}

export function assertAuthConfiguration() {
  getJwtSecret();
}

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token is required' });
  }

  const token = authHeader.split('Bearer ')[1].trim();

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string; email: string };
    const admin = db.getAdminById(decoded.id);

    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized: Admin user not found' });
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

export function generateToken(adminId: string, email: string): string {
  return jwt.sign({ id: adminId, email }, getJwtSecret(), { expiresIn: '7d' });
}
