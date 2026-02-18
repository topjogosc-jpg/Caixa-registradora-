
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getBusinessInsights = async (transactions: Transaction[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const today = new Date().toLocaleDateString('pt-BR');
  const todayTransactions = transactions.filter(t => 
    new Date(t.timestamp).toLocaleDateString('pt-BR') === today
  );

  const totalSales = todayTransactions.length;
  const totalRevenue = todayTransactions.reduce((acc, t) => acc + t.total, 0);

  const prompt = `Analise os seguintes dados de vendas de hoje (${today}) de um pequeno mercado:
  - Total de vendas: ${totalSales}
  - Faturamento total: R$ ${totalRevenue.toFixed(2)}
  
  Forneça uma dica de negócio curta (máximo 2 frases) para aumentar as vendas ou fidelizar clientes. Seja motivador e prático.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Continue o bom trabalho! Cada venda é um passo para o sucesso.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Analise suas vendas para identificar os horários de maior pico.";
  }
};
