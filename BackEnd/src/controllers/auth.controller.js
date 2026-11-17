const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userModel = require('../models/user.model');
const { AppError } = require('../middleware/errorHandler');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

function authPayload(user) {
  return { token: signToken(user), user: userModel.toPublicUser(user) };
}

async function register(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
      throw new AppError(400, 'Nombre, correo válido y contraseña de al menos 6 caracteres son obligatorios.');
    }

    const existing = await userModel.findByEmail(email);
    if (existing) throw new AppError(409, 'Ya existe una cuenta con ese correo.');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, passwordHash });
    res.status(201).json(authPayload(user));
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      throw new AppError(400, 'Correo y contraseña son obligatorios.');
    }

    const user = await userModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new AppError(401, 'Correo o contraseña incorrectos.');
    }

    res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) throw new AppError(404, 'Usuario no encontrado.');
    res.json({ user: userModel.toPublicUser(user) });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, me };
