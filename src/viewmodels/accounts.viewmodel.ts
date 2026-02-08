import { useCallback, useEffect, useState } from "react";
import {
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../services/accounts.service.ts";
import { ApiRequestError } from "../services/http-client.ts";
import type { BankAccount } from "../models/entities.ts";
import type { CreateAccountRequest, UpdateAccountRequest } from "../models/dtos.ts";

export function useAccountsViewModel() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAccounts = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await listAccounts();
      setAccounts(data);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar contas.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleCreate = async (data: CreateAccountRequest) => {
    setSaving(true);
    try {
      await createAccount(data);
      await loadAccounts();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao criar conta.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdateAccountRequest) => {
    setSaving(true);
    try {
      await updateAccount(id, data);
      await loadAccounts();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao atualizar conta.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await deleteAccount(id);
      await loadAccounts();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao excluir conta.");
    } finally {
      setSaving(false);
    }
  };

  return {
    accounts,
    loading,
    saving,
    error,
    loadAccounts,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
