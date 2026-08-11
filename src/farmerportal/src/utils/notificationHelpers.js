// Notification helper functions for Farmer Portal

export async function notifyLabBatchReceived(data) {
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
      quantity: data.quantity,
      unit: data.unit,
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
