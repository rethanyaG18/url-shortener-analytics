const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

/**
 * Register a new user.
 */
const signup = async ({ name, email, password }) => {
  // Check if email already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { data: user, error } = await supabase
    .from('users')
    .insert({ name, email: email.toLowerCase(), password_hash })
    .select('id, name, email, created_at')
    .single();

  if (error) throw new Error(error.message);

  const token = generateToken(user);
  return { user, token };
};

/**
 * Login with email and password.
 */
const login = async ({ email, password }) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, password_hash, created_at')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const { password_hash, ...safeUser } = user;
  const token = generateToken(safeUser);
  return { user: safeUser, token };
};

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { signup, login };
