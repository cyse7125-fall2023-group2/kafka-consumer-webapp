# Kafka, Consumer Web Application, and PostgreSQL

This project demonstrates an end-to-end flow where data is produced to a Kafka topic, consumed by a web application, and subsequently written to a PostgreSQL database. The integration showcases the power of real-time data processing using Apache Kafka and the persistence of data in a PostgreSQL database.

## Project Overview

The project comprises three main components:

1. **Kafka Deployment:**
    - Apache Kafka is used as the messaging backbone for real-time data streaming. This Helm chart facilitates the deployment of Kafka brokers in a scalable and fault-tolerant manner.

2. **Web Application:**
    - The web application is responsible for consuming messages from a Kafka topic.
    - It processes the incoming data and writes it to a PostgreSQL database.

3. **PostgreSQL Database:**
    - PostgreSQL is utilized as the backend database for persisting the processed data from the web application.

## Prerequisites

- Helm should be installed in your Kubernetes cluster.
- [Optionally] Kafka, Zookeeper, and PostgreSQL should be available in your container registry.

## Installing the Chart

```bash
# Add the Helm repository for postgres & kafka
helm repo add 

# Install the chart with the release name "consumer"
helm install consumer
