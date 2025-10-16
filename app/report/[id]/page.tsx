import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Report — {params.id}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-muted-foreground">AI Score</div>
            <div className="text-2xl font-semibold">84</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Manual Score</div>
            <div className="text-2xl font-semibold">82</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-muted-foreground">Confidence</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div className="h-2 w-4/5 rounded-full bg-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question-wise Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <AccordionItem key={i} value={`q${i + 1}`}>
                <AccordionTrigger>Question {i + 1}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium">Student Answer</div>
                      <p className="mt-2 text-sm text-muted-foreground">{"Sample student response..."}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Model Answer</div>
                      <p className="mt-2 text-sm text-muted-foreground">{"Sample model answer..."}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
