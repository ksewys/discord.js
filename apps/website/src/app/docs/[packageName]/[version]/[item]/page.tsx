// import { readFile } from 'node:fs/promises';
// import { join } from 'node:path';
// import { inspect } from 'node:util';
import { Code2, FileCode2 } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { Alert } from '~/components/Alert';
import { Badges } from '~/components/Badges';
import { DocNode } from '~/components/DocNode';
import { ExcerptNode } from '~/components/ExcerptNode';
import { OverlayScrollbarsComponent } from '~/components/OverlayScrollbars';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';

export default async function Page({ params }: { params: { item: string; packageName: string; version: string } }) {
	// const fileContent = await readFile(
	// 	join(
	// 		process.cwd(),
	// 		`../../packages/${params.packageName}/docs/split/${params.version}.${params.item.split(encodeURIComponent(':')).join('.')}.api.json`,
	// 	),
	// 	'utf8',
	// );
	// const parsedContent = JSON.parse(fileContent);

	const normalizeItem = params.item.split(encodeURIComponent(':')).join('.');
	const fileContent = await fetch(
		`${process.env.BLOB_STORAGE_URL}/rewrite/${params.packageName}/${params.version}.${normalizeItem}.api.json`,
	);
	const parsedContent = await fileContent.json();

	// console.log(inspect(parsedContent, { depth: 0 }));

	return (
		<div className="mx-auto flex max-w-3xl flex-col gap-8 p-6">
			{/* <div>{JSON.stringify(params)}</div> */}

			<div className="flex place-content-between place-items-center">
				<div className="flex flex-col gap-1">
					<h1 className="text-xl">
						<span className="text-green-500">{parsedContent.kind.toLowerCase()}</span>{' '}
						<span className="break-words font-bold">{parsedContent.displayName}</span>
					</h1>
					{parsedContent.implements ? (
						<div>
							<h2 className="inline-block min-w-min text-sm italic text-neutral-500 dark:text-neutral-400">
								implements
							</h2>{' '}
							<span className="break-words font-mono text-sm">
								<ExcerptNode node={parsedContent.implements} version={params.version} />
							</span>
						</div>
					) : null}
					{parsedContent.extends ? (
						<div>
							<h2 className="inline-block min-w-min text-sm italic text-neutral-500 dark:text-neutral-400">extends</h2>{' '}
							<span className="break-words font-mono text-sm">
								<ExcerptNode node={parsedContent.extends} version={params.version} />
							</span>
						</div>
					) : null}
					<Badges item={parsedContent} />
				</div>
				<a
					className="min-w-min"
					href={
						parsedContent.sourceLine
							? `${parsedContent.sourceURL}#L${parsedContent.sourceLine}`
							: parsedContent.sourceURL
					}
					rel="external noreferrer noopener"
					target="_blank"
				>
					<FileCode2
						size={20}
						className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
					/>
				</a>
			</div>

			<OverlayScrollbarsComponent
				defer
				options={{
					overflow: { y: 'hidden' },
					scrollbars: { autoHide: 'leave', autoHideDelay: 500, autoHideSuspend: true, clickScroll: true },
				}}
				className="rounded-md border border-neutral-300 dark:border-neutral-700"
			>
				<SyntaxHighlighter className="py-3 text-sm" lang="typescript" code={parsedContent.sourceExcerpt} />
			</OverlayScrollbarsComponent>

			{parsedContent.summary?.deprecatedBlock.length ? (
				<Alert title="Deprecated" type="danger">
					<p className="break-words">
						<DocNode node={parsedContent.summary.deprecatedBlock} version={params.version} />
					</p>
				</Alert>
			) : null}

			{parsedContent.summary?.summarySection ? (
				<p>
					<DocNode node={parsedContent.summary.summarySection} version={params.version} />
				</p>
			) : null}

			{parsedContent.summary?.seeBlocks.length ? (
				<p className="break-words pl-4">
					<span className="font-semibold">See also:</span>{' '}
					<DocNode node={parsedContent.summary.seeBlocks} version={params.version} />
				</p>
			) : null}

			{parsedContent.constructor?.parametersString ? (
				<div className="flex flex-col gap-4">
					<h2 className="text-lg font-bold">Constructors</h2>

					<div className="flex place-content-between place-items-center">
						<h3 className="break-words font-mono font-semibold">
							{/* constructor({parsedContent.constructor.parametersString}) */}
							constructor(
							{parsedContent.constructor.parameters?.length
								? parsedContent.constructor.parameters.map((parameter: any, idx: number) => {
										return (
											<span
												key={`${parameter.name}-${idx}`}
												className='after:content-[",_"] last-of-type:after:content-none'
											>
												{parameter.name}
												{parameter.isOptional ? '?' : ''}:{' '}
												<ExcerptNode node={parameter.typeExcerpt} version={params.version} />
											</span>
										);
									})
								: ''}
							)
						</h3>
						<a
							className="min-w-min"
							href={
								parsedContent.constructor.sourceLine
									? `${parsedContent.constructor.sourceURL}#L${parsedContent.constructor.sourceLine}`
									: parsedContent.constructor.sourceURL
							}
							rel="external noreferrer noopener"
							target="_blank"
						>
							<Code2
								size={20}
								className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
							/>
						</a>
					</div>

					{parsedContent.constructor.summary?.summarySection.length ? (
						<p className="break-words pl-4">
							<DocNode node={parsedContent.constructor.summary.summarySection} version={params.version} />
						</p>
					) : null}
				</div>
			) : null}

			{parsedContent.typeParameters?.length ? (
				<div className="flex flex-col gap-4">
					<h2 className="text-lg font-bold">Type Parameters</h2>

					{parsedContent.typeParameters.map((typeParameter: any, idx: number) => {
						return (
							<Fragment key={`${typeParameter.name}-${idx}`}>
								<h3 className="break-words font-mono font-semibold">
									<Badges item={typeParameter} /> {typeParameter.name}
									{typeParameter.constraintsExcerpt.length ? (
										<>
											{' extends '}
											<ExcerptNode node={typeParameter.constraintsExcerpt} version={params.version} />
										</>
									) : null}
									{typeParameter.defaultExcerpt.length ? (
										<>
											{' = '}
											<ExcerptNode node={typeParameter.defaultExcerpt} version={params.version} />
										</>
									) : null}
								</h3>
							</Fragment>
						);
					})}
				</div>
			) : null}

			{parsedContent.members?.properties?.length ? (
				<div className="flex flex-col gap-4">
					<h2 className="text-lg font-bold">Properties</h2>

					{parsedContent.members.properties.map((property: any, idx: number) => {
						return (
							<Fragment key={`${property.displayName}-${idx}`}>
								<div className="flex place-content-between place-items-center">
									<h3 className="break-words font-mono font-semibold">
										<Badges item={property} /> {property.displayName}
										{property.isOptional ? '?' : ''} :{' '}
										<ExcerptNode node={property.typeExcerpt} version={params.version} />
									</h3>
									<a
										className="min-w-min"
										href={property.sourceLine ? `${property.sourceURL}#L${property.sourceLine}` : property.sourceURL}
										rel="external noreferrer noopener"
										target="_blank"
									>
										<Code2
											size={20}
											className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
										/>
									</a>
								</div>

								{property.summary?.deprecatedBlock.length ? (
									<Alert title="Deprecated" type="danger">
										<p className="break-words">
											<DocNode node={property.summary.deprecatedBlock} version={params.version} />
										</p>
									</Alert>
								) : null}

								{property.summary?.summarySection.length ? (
									<p className="break-words pl-4">
										<DocNode node={property.summary.summarySection} version={params.version} />
									</p>
								) : null}

								{property.inheritedFrom ? (
									<p className="break-words pl-4">
										<span className="font-semibold">Inherited from:</span>{' '}
										<Link
											className="font-mono text-blurple hover:text-blurple-500 dark:hover:text-blurple-300"
											href={`/docs/${params.packageName}/${params.version}/${property.inheritedFrom}`}
										>
											{property.inheritedFrom.slice(0, property.inheritedFrom.indexOf(':'))}
										</Link>
									</p>
								) : null}

								{property.summary?.seeBlocks.length ? (
									<p className="break-words pl-4">
										<span className="font-semibold">See also:</span>{' '}
										<DocNode node={property.summary.seeBlocks} version={params.version} />
									</p>
								) : null}
							</Fragment>
						);
					})}
				</div>
			) : null}

			{parsedContent.members?.methods?.length ? (
				<div className="flex flex-col gap-4">
					<h2 className="text-lg font-bold">Methods</h2>

					{parsedContent.members.methods.map((method: any, idx: number) => {
						return (
							<Fragment key={`${method.displayName}-${idx}`}>
								<div className="flex place-content-between place-items-center">
									<h3 className="break-words font-mono font-semibold">
										<Badges item={method} /> {method.displayName}({method.parametersString}) :{' '}
										<ExcerptNode node={method.returnTypeExcerpt} version={params.version} />
									</h3>
									<a
										className="min-w-min"
										href={method.sourceLine ? `${method.sourceURL}#L${method.sourceLine}` : method.sourceURL}
										rel="external noreferrer noopener"
										target="_blank"
									>
										<Code2
											size={20}
											className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300"
										/>
									</a>
								</div>

								{method.summary?.deprecatedBlock.length ? (
									<Alert title="Deprecated" type="danger">
										<p className="break-words">
											<DocNode node={method.summary.deprecatedBlock} version={params.version} />
										</p>
									</Alert>
								) : null}

								{method.summary?.summarySection.length ? (
									<p className="break-words pl-4">
										<DocNode node={method.summary.summarySection} version={params.version} />
									</p>
								) : null}

								{method.summary?.exampleBlocks.length ? (
									<div className="break-words pl-4">
										<span className="font-semibold">Examples:</span>
										<DocNode node={method.summary.exampleBlocks} version={params.version} />
									</div>
								) : null}

								{method.summary?.returnsBlock.length ? (
									<p className="break-words pl-4">
										<span className="font-semibold">Returns:</span>{' '}
										<DocNode node={method.summary.returnsBlock} version={params.version} />
									</p>
								) : null}

								{method.inheritedFrom ? (
									<p className="break-words pl-4">
										<span className="font-semibold">Inherited from:</span>{' '}
										<Link
											className="font-mono text-blurple hover:text-blurple-500 dark:hover:text-blurple-300"
											href={`/docs/${params.packageName}/${params.version}/${method.inheritedFrom}`}
										>
											{method.inheritedFrom.slice(0, method.inheritedFrom.indexOf(':'))}
										</Link>
									</p>
								) : null}
							</Fragment>
						);
					})}
				</div>
			) : null}
		</div>
	);
}
