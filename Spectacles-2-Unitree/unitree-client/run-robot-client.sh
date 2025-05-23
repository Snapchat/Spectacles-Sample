sudo docker run \
  -p 7000:7000 \
  -it \
  --rm \
  --runtime=nvidia \
  --gpus=all \
  --net=host \
  --cap-add=NET_ADMIN \
  CONTAINER_URL