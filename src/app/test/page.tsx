"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Component Test Page</h1>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Separator Test</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p>Content above separator</p>
                        <Separator />
                        <p>Content below separator</p>
                    </div>
                </CardContent>
            </Card>

            <Button>Test Button</Button>
        </div>
    );
} 