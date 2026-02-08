import { useCallback, useEffect, useState } from "react";
import {
  listCreditCards,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard,
} from "../services/credit-cards.service.ts";
import { listCreditCardTransactions } from "../services/credit-card-transactions.service.ts";
import { ApiRequestError } from "../services/http-client.ts";
import type { CreditCard } from "../models/entities.ts";
import type {
  CreateCreditCardRequest,
  UpdateCreditCardRequest,
} from "../models/dtos.ts";

export function useCreditCardsViewModel() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [spentByCard, setSpentByCard] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCards = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = await listCreditCards();
      setCards(data);

      // Calcular spent por cartão com base no ciclo de faturamento atual
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const spent: Record<string, number> = {};

      const cardPromises = data.map(async (card) => {
        try {
          const cardTxs = await listCreditCardTransactions(card.ID);
          const closeDay = card.CloseDay;
          const cycleStart = new Date(currentYear, currentMonth - 1, closeDay);
          const cycleEnd = new Date(currentYear, currentMonth, closeDay);

          spent[card.ID] = cardTxs
            .filter((tx) => {
              const txDate = new Date(tx.TransactionDate);
              return txDate >= cycleStart && txDate < cycleEnd;
            })
            .reduce((sum, tx) => sum + parseFloat(tx.Amount), 0);
        } catch {
          spent[card.ID] = 0;
        }
      });
      await Promise.all(cardPromises);
      setSpentByCard(spent);
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
    spentByCard,
    loading,
    saving,
    error,
    loadCards,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
