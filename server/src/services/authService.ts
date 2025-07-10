import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';
import { config } from '../config/config';
import { User } from '../types';

export class AuthService {
  static async registerUser(userData: {
    full_name: string;
    phone: string;
    email?: string;
    password: string;
    user_type: 'farmer' | 'driver';
  }): Promise<{ user: User; token: string }> {
    const { full_name, phone, email, password, user_type } = userData;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        full_name,
        phone,
        email,
        password_hash: hashedPassword,
        user_type,
        is_verified: false
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create user: ' + error.message);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, user_type: user.user_type },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return { user, token };
  }

  static async loginUser(phone: string, password: string): Promise<{ user: User; token: string }> {
    // Find user by phone
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !user) {
      throw new Error('Invalid phone number or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid phone number or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, user_type: user.user_type },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Remove password hash from response
    delete user.password_hash;

    return { user, token };
  }

  static async getUserById(userId: string): Promise<User | null> {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, phone, full_name, user_type, created_at, updated_at, is_verified, profile_image')
      .eq('id', userId)
      .single();

    if (error) {
      return null;
    }

    return user;
  }

  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    const { data: user, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, email, phone, full_name, user_type, created_at, updated_at, is_verified, profile_image')
      .single();

    if (error) {
      throw new Error('Failed to update user profile: ' + error.message);
    }

    return user;
  }
}