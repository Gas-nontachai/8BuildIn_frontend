"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { PurchaseRequest } from "@/misc/types";
import { usePurchaseRequest } from "@/hooks/hooks";

const PurchaseRequestDetailPage = () => {
    const searchParams = useSearchParams();
    const purchase_request_id = searchParams.get("pr_id");

    const { getPurchaseRequestByID } = usePurchaseRequest();

    const [pr, setPR] = useState<PurchaseRequest | null>(null);

    useEffect(() => {
        if (purchase_request_id) {
            fetchData();
        }
    }, [purchase_request_id]);

    const fetchData = async () => {
        const res = await getPurchaseRequestByID({ pr_id: purchase_request_id || "" });
        setPR(res);
    };

    return (
        <div>
            {pr ? (
                <>
                    <h1>Purchase Request ID: {pr.pr_id}</h1>
                    <p>Status: {pr.pr_status}</p>
                    <p>Note: {pr.pr_note}</p>

                    <h2>Products:</h2>
                    {pr.product ? (
                        <ul>
                            {JSON.parse(pr.product).map((prod: any, index: number) => (
                                <li key={index}>
                                    {prod.product_name} - {prod.product_quantity} {prod.unit_id} ({prod.product_price} ฿)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No products found.</p>
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PurchaseRequestDetailPage;
