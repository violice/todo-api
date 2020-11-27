import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import prisma from 'prisma';

const createToken = (user) => jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' });

const auth = async (req, res) => {
  try {
    const { body: { username, password } } = req;
    if (!username) {
      return res.status(422).json({ error: 'Email is required' });
    }
    if (!password) {
      return res.status(422).json({ error: 'Password is required' });
    }
    let user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (!check) {
        return res.status(422).json({ error: 'Incorrect password' });
      }
    } else {
      const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
      user = await prisma.user.create({ data: { username, password: hash } });
    }
    delete user.password;
    const token = createToken(user);
    res.status(200).json({ user, token });
  } catch (e) {
    res.status(422).json({ error: e.message, raw: e });
  }
};

export { auth };
