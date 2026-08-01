import { Op } from 'sequelize';

export const buildColorFilter = (queryParams) => {
  if (!queryParams.color) return null;

  const colorString = queryParams.color.trim();
  if (!colorString) return null;

  const colors = colorString
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  if (colors.length === 0) return null;

  if (colors.length === 1) {
    return {
      color: {
        [Op.like]: `%${colors[0]}%`,
      },
    };
  }

  return {
    [Op.or]: colors.map(color => ({
      color: {
        [Op.like]: `%${color}%`,
      },
    })),
  };
};

export const hasColorFilter = (queryParams) => {
  return !!(queryParams.color && queryParams.color.trim());
};
