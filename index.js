var PORT = process.env.PORT || 3000;
import express from "express";
import { MongoClient, ServerApiVersion }from "mongodb";
import dotenv from "dotenv";
import 'dotenv/config';
import { dirname } from "path";
import { fileURLToPath } from "url";
