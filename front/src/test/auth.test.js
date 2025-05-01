import { expect, test } from "vitest";
import axios from "axios";
import { axiosInstance } from "../api/axiosInstance";
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090');

const authData = await pb.collection('users').authWithPassword(
    'MarketingHead11',
    '11111111',
);

const ORG_ID = "n1ns713yyd9z6on";
const baseUrl = "http://127.0.0.1:8090/api/"

test("Test auth token", async () => {
    const form = new FormData()
    form.append('identity', 'MarketingHead11')
    form.append('password', '11111111')
  const { data } = await axios.post(
    `${baseUrl}collections/users/auth-with-password`,
    form
  );
  await expect(data).toHaveProperty("token");
});


test("Test request with token", async () => {
    const { data } = await axiosInstance(authData?.token).get(
      `collections/NumberOfAbsenceDays/records`,
    );
    await expect(data.items.length).toBeGreaterThan(0);
});

test("Test request without token", async () => {
    const { data } = await axiosInstance().get(
      `collections/NumberOfAbsenceDays/records`,
    );
    await expect(data.items.length).toBe(0);
});

test("Test request Contract list", async () => {
    const { data } = await axiosInstance().get(
      `collections/Contract/records`,
    );
    await expect(data.items.length).toBeGreaterThan(0);
});

test("Test request Notices list", async () => {
    const { data } = await axiosInstance().get(
      `collections/Notices/records`,
    );
    await expect(data.items.length).toBeGreaterThan(0);
});
