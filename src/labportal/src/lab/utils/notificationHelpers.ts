// Notification helper functions for creating notifications when events occur

export async function notifyFarmerBatchTested(batchData: {
  batchId: string;
  productName: string;
  farmerId: string;
  qualityGrade: string;
  quantity: number;
  unit: string;
  isApproved: boolean;
  reason?: string;
}) {
  try {
    const notificationType = batchData.isApproved ? 'BATCH_APPROVED' : 'BATCH_REJECTED';
    
    const notification = {
      type: notificationType,
      portalType: 'farmer',
      title: batchData.isApproved ? 'Batch Approved ✓' : 'Batch Rejected ✗',
      message: batchData.isApproved
        ? `Your batch ${batchData.batchId} (${batchData.productName}) has been approved with grade ${batchData.qualityGrade}.`
        : `Your batch ${batchData.batchId} (${batchData.productName}) has been rejected. ${batchData.reason ? `Reason: ${batchData.reason}` : 'Quality standards not met.'}`,
      batchId: batchData.batchId,
      productName: batchData.productName,
      farmerId: batchData.farmerId,
      qualityGrade: batchData.qualityGrade,
      quantity: batchData.quantity,
      unit: batchData.unit,
      status: batchData.isApproved ? 'approved' : 'rejected',
      reason: batchData.reason,
    };

    const response = await fetch('http://localhost:3001/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating farmer notification:', error);
  }
}

export async function notifyBothPortalsSentToManufacturing(data: {
  batchId: string;
  productName: string;
  farmerId: string;
  manufacturerName: string;
  qualityGrade: string;
  quantity: number;
  unit: string;
}) {
  try {
    // Notification for farmer
    const farmerNotification = {
      type: 'SENT_TO_MANUFACTURING',
      portalType: 'farmer',
      title: 'Sent to Manufacturing',
      message: `Your batch ${data.batchId} (${data.productName}) has been sent to ${data.manufacturerName} for manufacturing.`,
      batchId: data.batchId,
      productName: data.productName,
      farmerId: data.farmerId,
      manufacturerName: data.manufacturerName,
      qualityGrade: data.qualityGrade,
      quantity: data.quantity,
      unit: data.unit,
    };

    // Notification for lab
    const labNotification = {
      type: 'SENT_TO_MANUFACTURING',
      portalType: 'lab',
      title: 'Batch Forwarded to Manufacturing',
      message: `Batch ${data.batchId} (${data.productName}) has been successfully forwarded to ${data.manufacturerName}.`,
      batchId: data.batchId,
      productName: data.productName,
      manufacturerName: data.manufacturerName,
      qualityGrade: data.qualityGrade,
      quantity: data.quantity,
      unit: data.unit,
    };

    // Create both notifications
    await Promise.all([
      fetch('http://localhost:3001/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmerNotification),
      }),
      fetch('http://localhost:3001/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(labNotification),
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error creating manufacturing notifications:', error);
  }
}

export async function notifyLabBatchReceived(data: {
  batchId: string;
  productName: string;
  farmerName: string;
  farmerId: string;
}) {
  try {
    const notification = {
      type: 'BATCH_RECEIVED',
      portalType: 'lab',
      title: 'New Batch Received',
      message: `New batch ${data.batchId} (${data.productName}) received from ${data.farmerName} for testing.`,
      batchId: data.batchId,
      productName: data.productName,
      farmerName: data.farmerName,
      farmerId: data.farmerId,
    };

    const response = await fetch('http://localhost:3001/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating lab notification:', error);
  }
}
