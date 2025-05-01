import { expect, test } from "vitest";
import axios from "axios";
import { axiosInstance } from "../api/axiosInstance";
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090');

const authData = await pb.collection('users').authWithPassword(
    'MarketingHead11',
    '11111111',
);

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