import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDevice, deleteDevice, deviceAction, updateDevice } from "./api";

function handleError(error) {
  if (typeof error.response === "object") {
    if (typeof error.response.data === "object") {
      alert(error.response.data.error);
      return;
    }
  }
  alert(error.message);
}

export function useCreateDevice(onSuccess) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (device) => createDevice(device),
    onError: (error) => handleError(error),
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (device) => updateDevice(device),
    onError: (error) => handleError(error),
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["devices"] }),
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteDevice(id),
    onError: (error) => handleError(error),
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["devices"] }),
  });
}

export function useDeviceAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (device) => deviceAction(device),
    onError: (error) => handleError(error),
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["devices"] }),
  });
}
