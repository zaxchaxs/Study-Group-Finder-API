import { FriendStatus, Prisma } from "@prisma/client";
import prisma from "../configs/prismaClient";
import { FriendStatusEnum, LoginUserType, PostUserType, UpdateUserType, UserFriend } from "../types/user";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { UserFriendDataType } from "../types/user-friend";

export async function getAllUser(whereClause?: Prisma.UserWhereInput) {
  return await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      profile: true
    },
  });
}

export async function getUser(whereClause: Prisma.UserWhereUniqueInput,) {
  return await prisma.user.findUnique({
    where: whereClause,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      userInterests: true
    }
  })
}

export async function createUser(data: PostUserType) {
  return await prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
    }
  });
}

export async function updateUser(id: number, data: UpdateUserType) {
  return await prisma.user.update({
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    },
    data
  })
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
    }
  })
}

export async function loginUser(data: LoginUserType) {
  return await prisma.user.findUnique({
    where: {
      email: data.email
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })
};

export async function changeUserPassword(id: number, password: string) {
  return await prisma.user.update({
    where: {
      id
    },
    data: {
      password
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export async function getUserByUsn(username: string) {
  return await prisma.user.findUnique({
    where: {
      username
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  })
}


// FriendShip
export async function getUserFriends(whereClause: Prisma.UserWhereUniqueInput, status?: FriendStatusEnum) {

  const friendRelations = await prisma.user.findUnique({
    where: whereClause,
    select: {
      friendsInitiated: { // User sebagai requester
        where: {
          status
        },
        select: {
          id: true,
          requesterId: true,
          receiverId: true,
          receiver: { // Pilih detail teman(yang menerima permintaan user)
            select: {
              id: true,
              email: true,
              username: true,
              name: true,
              avatar: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          status: true
        },
      },
      friendsReceived: { // User sebagai receiver
        where: {
          status
        },
        select: {
          id: true,
          requesterId: true,
          receiverId: true,
          requester: { // Pilih detail teman saya (permintaan user)
            select: {
              id: true,
              email: true,
              username: true,
              name: true,
              avatar: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            }
          },
          status: true
        },
      },
    },
  });

  if (!friendRelations) {
    return []
  };

  const allFriends: UserFriendDataType[] = [];
  // Tambahkan teman dari permintaan yang saya kirim
  friendRelations.friendsInitiated.forEach(fs => {
    allFriends.push({ ...fs, type: "receiver" });
  });

  // Tambahkan teman dari permintaan yang saya terima
  friendRelations.friendsReceived.forEach(fs => {
    allFriends.push({ ...fs, type: "requester" });
    // if (fs.requester) {
    //   // Pastikan tidak ada duplikasi jika pengguna mem-query dirinya sendiri atau ada kasus edge lainnya
    //   // Meskipun dengan desain status ACCEPTED, duplikasi seharusnya tidak terjadi.
    //   // Namun, untuk jaga-jaga, bisa pakai Set atau filter manual.
    //   if (!allFriends.some(f => f.id === fs.requester.id)) {
    //     allFriends.push({...fs.requester, status: fs.status});
    //   }
    // }
  });

  return allFriends;
  // return friendRelations;
};

export async function requestFriend(data: { requesterId: number, receiverId: number }) {
  const receiver = await prisma.user.findUnique({
    where: { id: data.receiverId },
    select: { id: true },
  });
  if (!receiver) {
    throw new Error("Receiver user not found");
  };
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        {
          requesterId: data.requesterId,
          receiverId: data.receiverId,
        },
        {
          requesterId: data.receiverId, // Jika receiver sudah pernah mengirim request ke requester
          receiverId: data.requesterId,
        },
      ],
      NOT: {
        status: FriendStatus.REJECTED // Abaikan jika sudah pernah ditolak (jika Anda menyimpannya)
      }
    },
  });
  if (existingFriendship) {
    if (existingFriendship.status === FriendStatus.PENDING) {
      throw new Error("Friend request already sent or pending acceptance.");
    }
    if (existingFriendship.status === FriendStatus.ACCEPTED) {
      throw new Error("Already friends.");
    }
    if (existingFriendship.status === FriendStatus.BLOCKED) {
      throw new Error("Cannot send request, blocked by user.");
    }
  }

  // Buat permintaan pertemanan baru
  return await prisma.friendship.create({
    data,
    select: {
      id: true,
      requesterId: true,
      receiverId: true,
      receiver: { // Pilih detail teman saya (permintaan user)
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      status: true
    },
  });
}

export async function AcceptRequestFriend(data: { requesterId: number, receiverId: number, status: FriendStatus }) {
  const friendship = await prisma.friendship.findFirst({
    // where: { id: data.requesterId },
    where: {
      AND: [
        { requesterId: data.requesterId },
        { receiverId: data.receiverId }
      ]
    }
  });
  if (!friendship) {
    throw new Error("Friend request not found.");
  }
  if (friendship.receiverId !== data.receiverId) {
    throw new Error('Unauthorized: You are not the receiver of this request.');
  }
  return await prisma.friendship.update({
    where: {
      id: friendship.id
    },
    data: { status: data.status },
  });
};

export async function deleteRequestFriend(id: number) {
  return await prisma.friendship.delete({
    where: {
      id
    }
  })
}