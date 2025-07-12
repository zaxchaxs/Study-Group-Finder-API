import prisma from "../configs/prismaClient";
import { NearbyUserType } from "../types/user";
import { PostUserProfileType } from "../types/user-profile";

export async function getUserProfile(userId: number) {
  const profile = await prisma.$queryRaw`
      SELECT
        id,
        userId,
        address,
        city,
        province,
        country,
        postalCode,
        ST_Y(location) AS longitude, -- Extract longitude
        ST_X(location) AS latitude,  -- Extract latitude
        isLocationShared,
        createdAt,
        updatedAt
      FROM user_profile
      WHERE userId = ${userId};
    `;

  if (!profile || (profile as any[]).length === 0) {
    return null;
  }
  return (profile as any[])[0];
};

function assertValidCoords(lat?: number, lon?: number): void {
  if (lat === undefined || lon === undefined) return;
  if (lat < -90 || lat > 90) throw new Error('latitude must be between −90 and 90');
  if (lon < -180 || lon > 180) throw new Error('longitude must be between −180 and 180');
}

export async function upsertUserProfile(
  userId: number,
  data: PostUserProfileType
) {
  const {
    address,
    city,
    province,
    country,
    postalCode,
    latitude,
    longitude,
    isLocationShared,
  } = data;

  assertValidCoords(latitude, longitude);

  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  // Re-usable SQL fragment that creates a POINT with SRID 4326
  const POINT_4326 = 'ST_SRID(POINT(?, ?), 4326)'; // (lon, lat)

  let sql: string;
  let params: Array<string | number | boolean> = [];

  if (existingProfile) {
    const set: string[] = ['updatedAt = CURRENT_TIMESTAMP(3)'];

    if (address !== undefined) { set.push('address = ?'); params.push(address); }
    if (city !== undefined) { set.push('city = ?'); params.push(city); }
    if (province !== undefined) { set.push('province = ?'); params.push(province); }
    if (country !== undefined) { set.push('country = ?'); params.push(country); }
    if (postalCode !== undefined) { set.push('postalCode = ?'); params.push(postalCode); }

    // always update the flag
    set.push('isLocationShared = ?');
    params.push(isLocationShared);

    if (isLocationShared && latitude !== undefined && longitude !== undefined) {
      set.push(`location = ${POINT_4326}`);
      params.push(longitude, latitude);
    } else if (!isLocationShared) {
      set.push(`location = ${POINT_4326}`);
      params.push(0, 0);
    }

    sql = `UPDATE user_profile SET ${set.join(', ')} WHERE userId = ?`;
    params.push(userId);
  } else {
    // INSERT
    const cols: string[] = ['userId', 'isLocationShared', 'createdAt', 'updatedAt'];
    const vals: string[] = ['?', '?', 'CURRENT_TIMESTAMP(3)', 'CURRENT_TIMESTAMP(3)'];
    const p: Array<string | number | boolean> = [userId, isLocationShared];

    if (address !== undefined) { cols.push('address'); vals.push('?'); p.push(address); }
    if (city !== undefined) { cols.push('city'); vals.push('?'); p.push(city); }
    if (province !== undefined) { cols.push('province'); vals.push('?'); p.push(province); }
    if (country !== undefined) { cols.push('country'); vals.push('?'); p.push(country); }
    if (postalCode !== undefined) { cols.push('postalCode'); vals.push('?'); p.push(postalCode); }

    cols.push('location');
    vals.push(POINT_4326);
    if (isLocationShared && latitude !== undefined && longitude !== undefined) {
      p.push(longitude, latitude);
    } else {
      p.push(0, 0);
    }

    sql = `INSERT INTO user_profile (${cols.join(', ')}) VALUES (${vals.join(', ')})`;
    params = p;
  }

  return prisma.$executeRawUnsafe(sql, ...params);
};

/**
 * @param latitude   caller's latitude   (−90 … 90)
 * @param longitude  caller's longitude  (−180 … 180)
 * @param radius     search radius in meters   (default 5 000 m)
 * @param limit      max number of rows        (default 20)
 */

export async function findNearbyUsers(
  latitude: number,
  longitude: number,
  radius = 5_000,
  limit = 20
): Promise<NearbyUserType[]> {
  const sql = `
    SELECT
      -- data from the User table
      u.id, u.name, u.email, u.name, u.avatar,

      -- columns from user_profile
      up.id AS profileId,
      up.address,
      up.city,
      up.province,
      up.country,
      up.postalCode,
      up.isLocationShared,
      up.createdAt,
      up.updatedAt,

      -- extract coordinates from POINT(lon, lat)
      ST_X(up.location) AS latitude,  -- X = lat
      ST_Y(up.location) AS longitude,   -- Y = lon

      -- optional: distance in meters from the caller
      ST_Distance_Sphere(
        up.location,
        ST_SRID(POINT(?, ?), 4326)     -- (lon, lat) param order
      ) AS distance

    FROM user_profile  up
    JOIN user          u  ON u.id = up.userId

    WHERE up.isLocationShared = true
      AND ST_Distance_Sphere(
            up.location,
            ST_SRID(POINT(?, ?), 4326)
          ) <= ?

    ORDER BY distance ASC
    LIMIT ?
  `;

  const rows = await prisma.$queryRawUnsafe(
    sql,
    longitude, latitude,
    longitude, latitude, // for the WHERE filter
    radius,
    limit
  );

  return rows as NearbyUserType[];
}




export async function deleteUserProfile(id: number) {
  return await prisma.userProfile.delete({
    where: {
      id
    }
  })
}
