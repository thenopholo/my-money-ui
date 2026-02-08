import { useCallback, useEffect, useState } from "react";
import {
  listCreditCards,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard,
} from "../services/credit-cards.service.ts";
import { ApiRequestError } from "../services/http-client.ts";
import type { CreditCard } from "../models/entities.ts";
import type {
  CreateCreditCardRequest,
  UpdateCreditCardRequest,
} from "../models/dtos.ts";

export function useCreditCardsViewModel() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCards = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await listCreditCards();
      setCards(data);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Erro ao carregar cartões.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleCreate = async (data: CreateCreditCardRequest) => {
    setSaving(true);
    try {
      await createCreditCard(data);
      await loadCards();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao criar cartão.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdateCreditCardRequest) => {
    setSaving(true);
    try {
      await updateCreditCard(id, data);
      await loadCards();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao atualizar cartão.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await deleteCreditCard(id);
      await loadCards();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        throw err;
      }
      throw new Error("Erro ao excluir cartão.");
    } finally {
      setSaving(false);
    }
  };

  return {
    cards,
    loading,
    saving,
    error,
    loadCards,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
